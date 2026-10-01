"use client";

import { useEffect, useState } from "react";

export interface GameSearchResult {
  id: number;
  name: string;
  coverUrl: string | null;
  releaseYear: string | null;
}

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;

interface SettledSearch {
  query: string;
  results: GameSearchResult[];
}

/**
 * Debounced search against /api/games/search (our RAWG proxy route).
 * Returns empty results until `query` is at least MIN_QUERY_LENGTH chars.
 */
export function useGameSearch(query: string) {
  // The most recent search that finished. State is only set from inside the
  // async callback below, never synchronously in the effect body.
  const [settled, setSettled] = useState<SettledSearch>({
    query: "",
    results: [],
  });

  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!active) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/games/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );

        const data: { results?: GameSearchResult[] } = res.ok
          ? await res.json()
          : {};

        setSettled({ query: trimmed, results: data.results ?? [] });
      } catch (error) {
        // AbortError just means a newer keystroke cancelled this request.
        if ((error as Error).name === "AbortError") return;
        console.error("Game search failed:", error);
        setSettled({ query: trimmed, results: [] });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [active, trimmed]);

  // Derived, not stored: we're "loading" whenever the latest finished search
  // isn't for what's currently typed.
  const upToDate = active && settled.query === trimmed;

  return {
    results: upToDate ? settled.results : [],
    loading: active && !upToDate,
  };
}
