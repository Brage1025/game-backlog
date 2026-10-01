"use client";

import { useLocalStorage } from "@/lib/use-local-storage";
import type { Game } from "@/lib/types";

const GAMES_STORAGE_KEY = "game-backlog:games";

const NO_GAMES: Game[] = [];

/** The one place that knows where games live, so every page reads the same data. */
export function useGames() {
  return useLocalStorage<Game[]>(GAMES_STORAGE_KEY, NO_GAMES);
}
