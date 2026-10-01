// Plain module (no "use client"): the server layout reads the constants,
// and the sidebar calls toggleTheme() from a click handler in the browser.
export type Theme = "dark" | "light";

export const THEME_COOKIE = "game-backlog-theme";
export const DEFAULT_THEME: Theme = "dark";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Flips between dark and light: updates the class on <html> right away and
 * saves the choice in a cookie, so the server can render the right theme
 * on the next page load. Only call this from the browser (e.g. onClick).
 */
export function toggleTheme() {
  const root = document.documentElement;
  const next: Theme = root.classList.contains("dark") ? "light" : "dark";

  root.classList.toggle("dark", next === "dark");
  document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
