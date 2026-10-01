"use client";

import { useCallback, useEffect } from "react";

import { useLocalStorage } from "@/lib/use-local-storage";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const DEFAULT_THEME: Theme = "dark";

/**
 * Remembers the chosen theme and applies it by toggling the "dark" class on <html>.
 * The very first paint is handled by the inline script in layout.tsx; this hook
 * takes over for changes after that.
 */
export function useTheme() {
  const [theme, setTheme, hydrated] = useLocalStorage<Theme>(
    THEME_STORAGE_KEY,
    DEFAULT_THEME
  );

  useEffect(() => {
    // Wait until the stored theme is loaded, otherwise this would briefly
    // apply the default and flash dark for people who chose light.
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme !== "light");
  }, [theme, hydrated]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
