import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AchievementState } from "@/lib/achievements";

export function AchievementCard({
  achievement,
}: {
  achievement: AchievementState;
}) {
  const { title, description, icon: Icon, current, target, unlocked } =
    achievement;

  return (
    <Card className={unlocked ? "border-chart-3/40 ring-chart-3/40" : undefined}>
      <CardContent className="flex items-start gap-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
            unlocked
              ? "bg-chart-3/15 text-chart-3"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium">{title}</h3>
            {unlocked && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-chart-3">
                <Check className="size-3.5" />
                Unlocked
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>

          {!unlocked && target > 1 && (
            <div className="mt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-3/70"
                  style={{ width: `${(current / target) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {current} / {target}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
