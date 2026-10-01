export type GameStatus = "Backlog" | "Playing" | "Completed" | "Dropped";

export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  status: GameStatus;
}

export interface Profile {
  username: string;
  /** Small square JPEG stored as a data URL, or null for the default avatar. */
  avatarUrl: string | null;
}

/**
 * A friend, built from a share code they sent you. This is a snapshot, not
 * a live connection -- it only updates when you import a newer code from
 * them (see lib/share-code.ts and lib/use-friends.ts).
 */
export interface Friend {
  id: string;
  username: string;
  /** Friends' profile pictures aren't included in share codes (keeps codes
   *  short to paste/send), so this just tracks whether they have one. */
  hasAvatar: boolean;
  games: Game[];
  /** ISO timestamp of when this snapshot was imported. */
  updatedAt: string;
}
