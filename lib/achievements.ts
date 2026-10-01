import {
  Archive,
  Award,
  Ban,
  Camera,
  Crown,
  Flag,
  Gamepad2,
  Layers,
  Library,
  Medal,
  Play,
  Plus,
  Scale,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";

import type { Game, GameStatus, Profile } from "@/lib/types";

export const ACHIEVEMENT_CATEGORIES = [
  "Library",
  "Finishing",
  "Habits",
  "Profile",
] as const;

export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

interface AchievementData {
  games: Game[];
  profile: Profile;
  counts: Record<GameStatus, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: LucideIcon;
  /** The value `progress` has to reach for the achievement to unlock. */
  target: number;
  /** How far along the user is, computed from their library and profile. */
  progress: (data: AchievementData) => number;
}

export interface AchievementState extends Achievement {
  /** `progress` capped at `target`, so progress bars never overflow. */
  current: number;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- Library size ---
  {
    id: "first-game",
    title: "First Steps",
    description: "Add your first game to the library.",
    category: "Library",
    icon: Plus,
    target: 1,
    progress: ({ games }) => games.length,
  },
  {
    id: "games-10",
    title: "Growing Collection",
    description: "Have 10 games in your library.",
    category: "Library",
    icon: Library,
    target: 10,
    progress: ({ games }) => games.length,
  },
  {
    id: "games-25",
    title: "Big Library",
    description: "Have 25 games in your library.",
    category: "Library",
    icon: Layers,
    target: 25,
    progress: ({ games }) => games.length,
  },
  {
    id: "games-50",
    title: "Collector",
    description: "Have 50 games in your library.",
    category: "Library",
    icon: Archive,
    target: 50,
    progress: ({ games }) => games.length,
  },

  // --- Finishing games ---
  {
    id: "complete-1",
    title: "Finish Line",
    description: "Complete your first game.",
    category: "Finishing",
    icon: Flag,
    target: 1,
    progress: ({ counts }) => counts.Completed,
  },
  {
    id: "complete-5",
    title: "Regular Finisher",
    description: "Complete 5 games.",
    category: "Finishing",
    icon: Medal,
    target: 5,
    progress: ({ counts }) => counts.Completed,
  },
  {
    id: "complete-10",
    title: "Completionist",
    description: "Complete 10 games.",
    category: "Finishing",
    icon: Award,
    target: 10,
    progress: ({ counts }) => counts.Completed,
  },
  {
    id: "complete-25",
    title: "Legend",
    description: "Complete 25 games.",
    category: "Finishing",
    icon: Crown,
    target: 25,
    progress: ({ counts }) => counts.Completed,
  },
  {
    id: "backlog-cleared",
    title: "Backlog Buster",
    description: "Have at least 5 games and none left in Backlog.",
    category: "Finishing",
    icon: Sparkles,
    target: 1,
    progress: ({ games, counts }) =>
      games.length >= 5 && counts.Backlog === 0 ? 1 : 0,
  },

  // --- Habits ---
  {
    id: "now-playing",
    title: "Player One",
    description: "Set a game to Playing.",
    category: "Habits",
    icon: Play,
    target: 1,
    progress: ({ counts }) => counts.Playing,
  },
  {
    id: "multitasker",
    title: "Multitasker",
    description: "Have 3 games marked as Playing at once.",
    category: "Habits",
    icon: Gamepad2,
    target: 3,
    progress: ({ counts }) => counts.Playing,
  },
  {
    id: "letting-go",
    title: "Letting Go",
    description: "Drop a game that isn't for you.",
    category: "Habits",
    icon: Ban,
    target: 1,
    progress: ({ counts }) => counts.Dropped,
  },
  {
    id: "balanced",
    title: "Balanced Diet",
    description: "Have at least one game in every status.",
    category: "Habits",
    icon: Scale,
    target: 4,
    progress: ({ counts }) =>
      Object.values(counts).filter((count) => count > 0).length,
  },

  // --- Profile ---
  {
    id: "username",
    title: "Who Goes There?",
    description: "Choose a username.",
    category: "Profile",
    icon: User,
    target: 1,
    progress: ({ profile }) => (profile.username.trim() ? 1 : 0),
  },
  {
    id: "avatar",
    title: "Say Cheese",
    description: "Upload a profile picture.",
    category: "Profile",
    icon: Camera,
    target: 1,
    progress: ({ profile }) => (profile.avatarUrl ? 1 : 0),
  },
];

/** Works out which achievements are unlocked, and how close the rest are. */
export function evaluateAchievements(
  games: Game[],
  profile: Profile,
): AchievementState[] {
  const counts: Record<GameStatus, number> = {
    Backlog: 0,
    Playing: 0,
    Completed: 0,
    Dropped: 0,
  };
  for (const game of games) counts[game.status]++;

  const data: AchievementData = { games, profile, counts };

  return ACHIEVEMENTS.map((achievement) => {
    const progress = achievement.progress(data);
    return {
      ...achievement,
      current: Math.min(progress, achievement.target),
      unlocked: progress >= achievement.target,
    };
  });
}
