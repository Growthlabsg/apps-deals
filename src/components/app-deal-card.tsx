"use client";

import Image from "next/image";
import type { App, Deal } from "@/types/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Tag, GitCompare, FlaskConical, Rocket, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDealTypeLabel, DEAL_TYPE_BADGE_CLASS } from "@/lib/deal-types";
import type { DealType } from "@/types/store";

const APP_TYPE_LABELS: Record<string, string> = {
  trial: "Trial",
  beta: "Beta",
  pilot: "Pilot",
  validation: "Validation",
  free: "Free",
  demo: "Demo",
  enterprise: "Enterprise",
};

interface AppDealCardProps {
  item: App | Deal;
  onView: (item: App | Deal) => void;
  onAddToCompare?: (app: App) => void;
  isInCompare?: (appId: string) => boolean;
  compareLimitReached?: boolean;
}

export function AppDealCard({ item, onView, onAddToCompare, isInCompare, compareLimitReached }: AppDealCardProps) {
  const isApp = item.type === "app";
  const app = isApp ? (item as App) : null;
  const title = isApp ? item.name : item.title;
  const metric = isApp
    ? `${item.usersCount} users`
    : (item as Deal).discount;
  const canAddToCompare = isApp && onAddToCompare && (!compareLimitReached || isInCompare?.(item.id));
  const inCompare = isApp && isInCompare?.(item.id);

  const seekingBadges = app
    ? [
        app.seekingBetaTesters && { label: "Seeking beta testers", icon: FlaskConical },
        app.seekingPilotUsers && { label: "Pilot open", icon: Rocket },
        app.seekingValidationUsers && { label: "Validation open", icon: Target },
      ].filter(Boolean) as { label: string; icon: typeof FlaskConical }[]
    : [];

  return (
    <Card
      className={cn(
        "overflow-hidden gs-card-hover cursor-pointer rounded-xl border-border",
        "transition-all duration-200 active:scale-[0.99]"
      )}
      onClick={() => onView(item)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {isApp && app?.appType && (
            <Badge className="bg-primary/90 text-white border-0 text-xs">
              {APP_TYPE_LABELS[app.appType] ?? app.appType}
            </Badge>
          )}
          {!isApp && (
            <>
              {(item as Deal).dealType && (
                <Badge
                  className={cn(
                    "text-xs border-0",
                    DEAL_TYPE_BADGE_CLASS[(item as Deal).dealType as DealType]
                  )}
                >
                  {getDealTypeLabel((item as Deal).dealType)}
                </Badge>
              )}
              {item.badges.map((b) => (
                <Badge
                  key={b}
                  variant={b === "Deal" || b === "Limited time" ? "deal" : "default"}
                >
                  {b}
                </Badge>
              ))}
            </>
          )}
          {isApp && item.badges.map((b) => (
            <Badge key={b} variant="default">{b}</Badge>
          ))}
          {seekingBadges.slice(0, 1).map(({ label, icon: Icon }) => (
            <Badge key={label} className="bg-amber-500/90 text-white border-0 text-xs">
              <Icon className="mr-0.5 h-3 w-3" />
              {label}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {isApp ? (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {metric}
              </span>
              {app?.trialPeriod && (
                <>
                  <span>·</span>
                  <span>{app.trialPeriod}</span>
                </>
              )}
              {app?.rating != null && (
                <>
                  <span>·</span>
                  <span>★ {app.rating}</span>
                </>
              )}
            </>
          ) : (
            <span className="flex items-center gap-1 font-medium text-[#0F7377] dark:text-teal-400">
              <Tag className="h-4 w-4" />
              {metric}
            </span>
          )}
          <span>·</span>
          <span>{item.publisher.name}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            className="flex-1 gs-gradient text-white hover:opacity-90 touch-manipulation"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
          >
            {isApp ? "View app" : "Get deal"}
          </Button>
          {canAddToCompare && (
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCompare(item as App);
              }}
              title={inCompare ? "In compare list" : "Add to compare"}
              aria-label={inCompare ? "In compare list" : "Add to compare"}
            >
              <GitCompare className={cn("h-4 w-4", inCompare && "text-primary")} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
