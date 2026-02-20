"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getApprovedApps,
  getLiveApps,
  hasLaunchCelebrationShown,
  setLaunchCelebrationShown,
  getMilestoneCelebrationsShown,
  setMilestoneCelebrationShown,
  LAUNCH_MILESTONE_THRESHOLDS,
} from "@/lib/store-data";

export type CelebrationKind = "launch" | "milestone";

export interface LaunchCelebrationData {
  kind: CelebrationKind;
  appId: string;
  appName: string;
  startupName: string;
  imageUrl: string;
  usersCount: number;
  dealsCount: number;
  /** Set when kind === "milestone" (e.g. 100, 500, 1000). */
  milestone?: number;
}

function getNextPendingCelebration(): LaunchCelebrationData | null {
  const apps = getApprovedApps();
  const liveApps = getLiveApps();
  const liveAppIds = new Set(liveApps.map((a) => a.id));

  type Pending = { app: (typeof apps)[0]; kind: "launch" | "milestone"; milestone?: number };
  const pending: Pending[] = [];

  for (const app of apps) {
    if (!liveAppIds.has(app.id)) continue;

    const count = app.usersCount ?? app.downloads ?? 0;

    if (!hasLaunchCelebrationShown(app.id)) {
      pending.push({ app, kind: "launch" });
      continue;
    }

    const shown = getMilestoneCelebrationsShown(app.id);
    for (const threshold of LAUNCH_MILESTONE_THRESHOLDS) {
      if (count >= threshold && !shown.includes(threshold)) {
        pending.push({ app, kind: "milestone", milestone: threshold });
        break;
      }
    }
  }

  pending.sort((a, b) => {
    if (a.kind === "launch" && b.kind !== "launch") return -1;
    if (a.kind !== "launch" && b.kind === "launch") return 1;
    if (a.kind === "milestone" && b.kind === "milestone") {
      return (a.milestone ?? 0) - (b.milestone ?? 0);
    }
    return 0;
  });

  const first = pending[0];
  if (!first) return null;

  return {
    kind: first.kind,
    appId: first.app.id,
    appName: first.app.name,
    startupName: first.app.publisher.name,
    imageUrl: first.app.imageUrl,
    usersCount: first.app.usersCount ?? 0,
    dealsCount: first.app.dealsCount ?? 0,
    milestone: first.milestone,
  };
}

export function useLaunchCelebration(appsReady: boolean) {
  const [data, setData] = useState<LaunchCelebrationData | null>(null);
  const hasAutoChecked = useRef(false);

  const trigger = useCallback((payload: LaunchCelebrationData) => {
    setData(payload);
  }, []);

  const close = useCallback(() => {
    setData((prev) => {
      if (prev) {
        if (prev.kind === "launch") setLaunchCelebrationShown(prev.appId);
        else if (prev.kind === "milestone" && prev.milestone != null)
          setMilestoneCelebrationShown(prev.appId, prev.milestone);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (!appsReady || hasAutoChecked.current) return;
    hasAutoChecked.current = true;
    const next = getNextPendingCelebration();
    if (next) setData(next);
  }, [appsReady]);

  return { data, trigger, close };
}
