"use client";

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";

const SYNC_EVENT = "local-storage-sync";

// Tells React when storage might have changed: "storage" fires for changes
// made in other tabs, and our own event covers writes from this tab.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SYNC_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SYNC_EVENT, onChange);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseOr<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const subscribeToNothing = () => () => {};

/**
 * Works like useState, but persists to localStorage under `key`.
 *
 * - On the server and during hydration it returns `initialValue`, then React
 *   switches to the stored value right after, so there's no hydration
 *   mismatch.
 * - The third value, `hydrated`, is false until the stored value is in use.
 *   Use it to avoid flashing default content.
 * - Every component using the same key stays in sync, including across tabs.
 *
 * `initialValue` should be a stable reference (a constant defined outside
 * the component), otherwise the parsed value is recomputed on every render.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null, // what the server (and hydration) sees: nothing stored
  );

  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const value = useMemo(() => parseOr(raw, initialValue), [raw, initialValue]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (action) => {
      try {
        // Read fresh from storage so several updates in a row build on
        // each other correctly.
        const current = parseOr(readRaw(key), initialValue);
        const next =
          typeof action === "function"
            ? (action as (prev: T) => T)(current)
            : action;

        window.localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new Event(SYNC_EVENT));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    },
    [key, initialValue],
  );

  return [value, setValue, hydrated];
}
