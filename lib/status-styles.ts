import type { GameStatus } from "@/lib/types";

// Readable in both themes: muted colors for light mode, brighter ones for dark.
export const STATUS_STYLES: Record<GameStatus, string> = {
  Backlog:
    "border-slate-400 text-slate-600 dark:border-slate-600 dark:text-slate-300",
  Playing:
    "border-emerald-600/40 bg-emerald-600/15 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-600/20 dark:text-emerald-400",
  Completed:
    "border-sky-600/40 bg-sky-600/15 text-sky-700 dark:border-sky-500/40 dark:bg-sky-600/20 dark:text-sky-400",
  Dropped:
    "border-rose-600/40 bg-rose-600/15 text-rose-700 dark:border-rose-500/40 dark:bg-rose-600/20 dark:text-rose-400",
};

export const STATUS_DOT_COLORS: Record<GameStatus, string> = {
  Backlog: "bg-slate-400",
  Playing: "bg-emerald-500",
  Completed: "bg-sky-500",
  Dropped: "bg-rose-500",
};

export const STATUS_LIST: GameStatus[] = [
  "Playing",
  "Backlog",
  "Completed",
  "Dropped",
];
