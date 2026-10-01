"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { AchievementCard } from "@/components/achievement-card";

import { ACHIEVEMENT_CATEGORIES, evaluateAchievements } from "@/lib/achievements";
import { STATUS_DOT_COLORS, STATUS_LIST, STATUS_STYLES } from "@/lib/status-styles";
import { useFriends } from "@/lib/use-friends";
import type { Game, GameStatus, Profile } from "@/lib/types";

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [friends, , friendsReady] = useFriends();

  if (!friendsReady) return null;

  const friend = friends.find((f) => f.id === id);

  if (!friend) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            href="/friends"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to friends
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">
            Couldn't find that friend. They may have been removed.
          </p>
        </div>
      </main>
    );
  }

  const counts: Record<GameStatus, number> = {
    Backlog: 0,
    Playing: 0,
    Completed: 0,
    Dropped: 0,
  };
  for (const game of friend.games) counts[game.status]++;
  const total = friend.games.length;

  // evaluateAchievements only checks avatarUrl for truthiness, so a
  // placeholder string stands in for the real (never-shared) image data.
  const pseudoProfile: Profile = {
    username: friend.username,
    avatarUrl: friend.hasAvatar ? "friend-has-avatar" : null,
  };
  const achievements = evaluateAchievements(friend.games, pseudoProfile);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/friends"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to friends
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <UserAvatar
            username={friend.username}
            avatarUrl={null}
            className="size-16 text-2xl"
          />
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {friend.username}
            </h1>
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "game" : "games"} &middot;{" "}
              {unlockedCount} of {achievements.length} achievements
            </p>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUS_LIST.map((status) => (
            <Card key={status}>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`size-2 rounded-full ${STATUS_DOT_COLORS[status]}`} />
                  {status}
                </div>
                <p className="mt-2 font-heading text-3xl font-semibold">
                  {counts[status]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Games */}
        <h2 className="mt-10 font-heading text-xl font-semibold">Games</h2>
        {total === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {friend.username}'s library is empty.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {friend.games.map((game) => (
              <FriendGameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Achievements */}
        <h2 className="mt-10 font-heading text-xl font-semibold">
          Achievements
        </h2>
        {ACHIEVEMENT_CATEGORIES.map((category) => {
          const inCategory = achievements.filter((a) => a.category === category);
          const unlockedInCategory = inCategory.filter((a) => a.unlocked);
          if (unlockedInCategory.length === 0) return null;

          return (
            <section key={category} className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {unlockedInCategory.map((a) => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            </section>
          );
        })}
        {unlockedCount === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No achievements unlocked yet in this snapshot.
          </p>
        )}
      </div>
    </main>
  );
}

function FriendGameCard({ game }: { game: Game }) {
  return (
    <Card className="overflow-hidden border-border bg-card p-0">
      <CardContent className="p-0">
        <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverUrl}
            alt={`${game.title} cover art`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-2">
          <p className="truncate text-sm font-medium">{game.title}</p>
          <Badge variant="outline" className={`mt-1 ${STATUS_STYLES[game.status]}`}>
            {game.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
