"use client";

import { useLocalStorage } from "@/lib/use-local-storage";
import type { Friend } from "@/lib/types";

const FRIENDS_STORAGE_KEY = "game-backlog:friends";

const NO_FRIENDS: Friend[] = [];

export function useFriends() {
  return useLocalStorage<Friend[]>(FRIENDS_STORAGE_KEY, NO_FRIENDS);
}
