"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, RefreshCw, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { FriendCodeDialog } from "@/components/friend-code-dialog";

import { generateShareCode } from "@/lib/share-code";
import { STATUS_DOT_COLORS, STATUS_LIST } from "@/lib/status-styles";
import { useFriends } from "@/lib/use-friends";
import { useGames } from "@/lib/use-games";
import { useProfile } from "@/lib/use-profile";
import type { Friend, GameStatus } from "@/lib/types";

export default function FriendsPage() {
  const [profile, , profileReady] = useProfile();
  const [games, , gamesReady] = useGames();
  const [friends, setFriends, friendsReady] = useFriends();

  const shareCode = useMemo(
    () => generateShareCode(profile, games),
    [profile, games],
  );

  function upsertFriend(friend: Friend) {
    setFriends((prev) => {
      const exists = prev.some((f) => f.id === friend.id);
      return exists
        ? prev.map((f) => (f.id === friend.id ? friend : f))
        : [friend, ...prev];
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Friends
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          There is no server here, so friends are not automatically kept in
          sync. Share codes are a snapshot of a library at the moment they are
          generated. Send your code to a friend, and paste theirs in below to
          add them. Got a newer code from someone you have already added? Paste
          it in again (or use the Update button on their card) and it will
          overwrite what is currently shown for them.
        </p>

        {/* Your own code: recomputed live, so it's always current. */}
        <Card className="mt-6">
          <CardContent>
            <h2 className="font-heading font-semibold">Your share code</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy this and send it to a friend so they can add you.
            </p>
            {profileReady && gamesReady ? (
              <ShareCodeBox code={shareCode} />
            ) : (
              <div className="mt-3 h-24 rounded-md bg-muted" aria-hidden />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Your friends</h2>
          <FriendCodeDialog
            mode="add"
            friends={friends}
            onSave={upsertFriend}
            trigger={
              <Button>
                <UserPlus />
                Add Friend
              </Button>
            }
          />
        </div>

        {friendsReady && friends.length === 0 && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No friends added yet. Paste a share code to add your first one.
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              friends={friends}
              onUpdate={upsertFriend}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ShareCodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked by browser permissions; the code is
      // still visible in the textarea for a manual copy either way.
    }
  }

  return (
    <div className="mt-3">
      <textarea
        readOnly
        value={code}
        rows={4}
        onFocus={(e) => e.target.select()}
        className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs text-muted-foreground shadow-sm outline-none"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={handleCopy}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy code"}
      </Button>
      {code.length > 1800 && (
        <p className="mt-2 text-xs text-muted-foreground">
          This code is long ({code.length} characters) because of how many games
          are in your library -- some chat apps cap message length, so a text
          file or email might work better than pasting it directly.
        </p>
      )}
    </div>
  );
}

function FriendCard({
  friend,
  friends,
  onUpdate,
}: {
  friend: Friend;
  friends: Friend[];
  onUpdate: (friend: Friend) => void;
}) {
  const counts: Record<GameStatus, number> = {
    Backlog: 0,
    Playing: 0,
    Completed: 0,
    Dropped: 0,
  };
  for (const game of friend.games) counts[game.status]++;

  const updatedLabel = formatRelativeTime(friend.updatedAt);

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/friends/${friend.id}`}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <UserAvatar username={friend.username} avatarUrl={null} />
            <div className="min-w-0">
              <p className="truncate font-medium">{friend.username}</p>
              <p className="text-xs text-muted-foreground">
                Updated {updatedLabel}
              </p>
            </div>
          </Link>

          <FriendCodeDialog
            mode="update"
            targetFriendId={friend.id}
            friends={friends}
            onSave={onUpdate}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Update ${friend.username}`}
              >
                <RefreshCw />
              </Button>
            }
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {STATUS_LIST.map((status) => (
            <span key={status} className="flex items-center gap-1.5">
              <span
                className={`size-2 rounded-full ${STATUS_DOT_COLORS[status]}`}
              />
              {counts[status]} {status}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}
