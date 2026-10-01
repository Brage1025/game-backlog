"use client";

import { useLocalStorage } from "@/lib/use-local-storage";
import type { Profile } from "@/lib/types";

const PROFILE_STORAGE_KEY = "game-backlog:profile";

const DEFAULT_PROFILE: Profile = { username: "", avatarUrl: null };

export function useProfile() {
  return useLocalStorage<Profile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE);
}
