"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Rocket, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LaunchCelebrationData } from "@/hooks/use-launch-celebration";

const CONFETTI_COLORS = ["#0F7377", "#00A884", "#FFD700", "#FF6B6B"];

function runConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: CONFETTI_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

interface LaunchCelebrationProps {
  data: LaunchCelebrationData | null;
  onClose: () => void;
  onShare?: () => void;
}

export function LaunchCelebration({ data, onClose, onShare }: LaunchCelebrationProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (data && !hasRun.current) {
      hasRun.current = true;
      runConfetti();
    }
  }, [data]);

  if (!data) return null;

  const isLaunch = data.kind === "launch";
  const title = isLaunch ? "App launched!" : `${data.milestone?.toLocaleString()} users!`;
  const subtitle = isLaunch
    ? "Your app is now live on GrowthLab."
    : `You hit ${data.milestone?.toLocaleString()} users — keep growing!`;
  const Icon = isLaunch ? Rocket : Trophy;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-8 text-white text-center overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="relative w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Icon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
            <p className="text-white/95 text-sm">{subtitle}</p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={data.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{data.appName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">by {data.startupName}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">Live</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.usersCount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Users</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.dealsCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Deals</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={onShare ?? (() => {})}>
                Share
              </Button>
              <Button className="flex-1 gs-gradient text-white rounded-xl" onClick={onClose}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
