import type { Game, GameStatus, Profile } from "@/lib/types";

const VALID_STATUSES: GameStatus[] = [
  "Backlog",
  "Playing",
  "Completed",
  "Dropped",
];

export interface ShareablePayload {
  version: 1;
  username: string;
  hasAvatar: boolean;
  games: Game[];
}

/**
 * Builds a share code from your profile and library. Deliberately leaves
 * out the profile picture itself (just whether you have one) -- an avatar
 * is a ~20KB data URL, which would make the code far too long to
 * comfortably paste into a chat app.
 */
export function generateShareCode(profile: Profile, games: Game[]): string {
  const payload: ShareablePayload = {
    version: 1,
    username: profile.username.trim() || "Player",
    hasAvatar: profile.avatarUrl !== null,
    games,
  };

  const json = JSON.stringify(payload);
  // btoa only handles Latin1 text, so UTF-8 characters (e.g. accented
  // names) are escaped first and unescaped again on decode.
  return btoa(unescape(encodeURIComponent(json)));
}

/** Throws a message-friendly Error if the code is malformed or tampered with. */
export function parseShareCode(code: string): ShareablePayload {
  let json: string;
  try {
    json = decodeURIComponent(escape(atob(code.trim())));
  } catch {
    throw new Error("That doesn't look like a valid share code.");
  }

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error("That doesn't look like a valid share code.");
  }

  if (!isShareablePayload(data)) {
    throw new Error("That code is missing some expected data.");
  }

  return data;
}

function isShareablePayload(data: unknown): data is ShareablePayload {
  if (typeof data !== "object" || data === null) return false;
  const value = data as Record<string, unknown>;

  return (
    value.version === 1 &&
    typeof value.username === "string" &&
    typeof value.hasAvatar === "boolean" &&
    Array.isArray(value.games) &&
    value.games.every(isGame)
  );
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Record<string, unknown>;

  return (
    typeof game.id === "string" &&
    typeof game.title === "string" &&
    typeof game.coverUrl === "string" &&
    typeof game.status === "string" &&
    VALID_STATUSES.includes(game.status as GameStatus)
  );
}
