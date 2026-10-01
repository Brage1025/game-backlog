"use client";

import { AchievementCard } from "@/components/achievement-card";
import {
  ACHIEVEMENT_CATEGORIES,
  evaluateAchievements,
} from "@/lib/achievements";
import { useGames } from "@/lib/use-games";
import { useProfile } from "@/lib/use-profile";

export default function AchievementsPage() {
  const [games, , gamesReady] = useGames();
  const [profile, , profileReady] = useProfile();
  const ready = gamesReady && profileReady;

  const achievements = evaluateAchievements(games, profile);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const percent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Achievements
        </h1>

        {/* Hidden (but still taking up space) until stored data has loaded,
            so everything doesn't flash as locked before unlocking. */}
        <div className={ready ? undefined : "invisible"}>
          <p className="mt-2 text-sm text-muted-foreground">
            {unlockedCount} of {achievements.length} unlocked
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Achievements unlocked"
            aria-valuemin={0}
            aria-valuemax={achievements.length}
            aria-valuenow={unlockedCount}
          >
            <div
              className="h-full rounded-full bg-chart-3 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          {ACHIEVEMENT_CATEGORIES.map((category) => (
            <section key={category} className="mt-10">
              <h2 className="font-heading text-xl font-semibold">{category}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {achievements
                  .filter((a) => a.category === category)
                  .map((a) => (
                    <AchievementCard key={a.id} achievement={a} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
