"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Camera, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";

import { resizeImageToDataUrl } from "@/lib/image";
import { useGames } from "@/lib/use-games";
import { useProfile } from "@/lib/use-profile";
import type { GameStatus, Profile } from "@/lib/types";

const MAX_USERNAME_LENGTH = 24;

const STAT_CARDS: { status: GameStatus; label: string; color: string }[] = [
  { status: "Playing", label: "Playing", color: "bg-emerald-500" },
  { status: "Backlog", label: "Backlogged", color: "bg-slate-400" },
  { status: "Completed", label: "Completed", color: "bg-sky-500" },
  { status: "Dropped", label: "Dropped", color: "bg-rose-500" },
];

export default function ProfilePage() {
  const [profile, setProfile, profileReady] = useProfile();
  const [games, , gamesReady] = useGames();

  const counts: Record<GameStatus, number> = {
    Backlog: 0,
    Playing: 0,
    Completed: 0,
    Dropped: 0,
  };
  for (const game of games) counts[game.status]++;

  const total = games.length;
  const completionRate = total > 0 ? Math.round((counts.Completed / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Profile
        </h1>

        {/* Profile editor: mounted only once stored data has loaded, so its
            form fields start from the real username instead of a blank one. */}
        <Card className="mt-6">
          <CardContent>
            {profileReady ? (
              <ProfileEditor profile={profile} setProfile={setProfile} />
            ) : (
              <div className="h-24" aria-hidden />
            )}
          </CardContent>
        </Card>

        <h2 className="mt-10 font-heading text-xl font-semibold">Your games</h2>

        {gamesReady && total === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing here yet.{" "}
            <Link href="/" className="text-primary underline underline-offset-4">
              Add your first game
            </Link>{" "}
            in the library.
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STAT_CARDS.map(({ status, label, color }) => (
                <Card key={status}>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`size-2 rounded-full ${color}`} />
                      {label}
                    </div>
                    <p className="mt-2 font-heading text-3xl font-semibold">
                      {gamesReady ? counts[status] : "–"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {gamesReady && total > 0 && (
              <div className="mt-6">
                <div
                  className="flex h-2 overflow-hidden rounded-full bg-muted"
                  role="img"
                  aria-label="Share of games by status"
                >
                  {STAT_CARDS.map(({ status, color }) =>
                    counts[status] > 0 ? (
                      <div
                        key={status}
                        className={color}
                        style={{ width: `${(counts[status] / total) * 100}%` }}
                      />
                    ) : null
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {total} {total === 1 ? "game" : "games"} in your library,{" "}
                  {completionRate}% completed.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// --- Profile editor ---------------------------------------------------------

interface ProfileEditorProps {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
}

function ProfileEditor({ profile, setProfile }: ProfileEditorProps) {
  const [username, setUsername] = useState(profile.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError("Enter a username.");
      return;
    }

    setProfile((prev) => ({ ...prev, username: trimmed }));
    setUsername(trimmed);
    setSaved(true);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets you pick the same file again later
    if (!file) return;

    try {
      const avatarUrl = await resizeImageToDataUrl(file);
      setProfile((prev) => ({ ...prev, avatarUrl }));
      setAvatarError(null);
    } catch (error) {
      setAvatarError(
        error instanceof Error ? error.message : "Couldn't use that image."
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-3">
        <UserAvatar
          username={profile.username}
          avatarUrl={profile.avatarUrl}
          className="size-24 text-3xl"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera />
            {profile.avatarUrl ? "Change" : "Upload photo"}
          </Button>
          {profile.avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setProfile((prev) => ({ ...prev, avatarUrl: null }))}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
        {avatarError && (
          <p className="max-w-40 text-center text-sm text-destructive">
            {avatarError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
        <Label htmlFor="username">Username</Label>
        <div className="flex gap-2">
          <Input
            id="username"
            value={username}
            maxLength={MAX_USERNAME_LENGTH}
            placeholder="Your name"
            autoComplete="off"
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(null);
              setSaved(false);
            }}
          />
          <Button type="submit">Save</Button>
        </div>
        {usernameError && (
          <p className="text-sm text-destructive">{usernameError}</p>
        )}
        {saved && <p className="text-sm text-muted-foreground">Saved.</p>}
      </form>
    </div>
  );
}
