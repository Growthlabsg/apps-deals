"use client";

import { useEffect, useState } from "react";
import { useLaunchCelebration } from "@/hooks/use-launch-celebration";
import { LaunchCelebration } from "@/components/launch-celebration";

export function LaunchCelebrationTracker() {
  const [appsReady, setAppsReady] = useState(false);
  const { data, close } = useLaunchCelebration(appsReady);

  useEffect(() => {
    const t = setTimeout(() => setAppsReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleShare = () => {
    if (!data) return;
    const url = typeof window !== "undefined" ? `${window.location.origin}/app/${data.appId}` : "";
    const text = data.kind === "launch"
      ? `My app "${data.appName}" is now live on GrowthLab!`
      : `${data.appName} just hit ${data.milestone?.toLocaleString()} users on GrowthLab!`;
    if (navigator.share) {
      navigator.share({ title: data.appName, text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return <LaunchCelebration data={data} onClose={close} onShare={handleShare} />;
}
