"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface GoalReachedModalProps {
  open: boolean;
  onClose: () => void;
  raised?: number;
  backers?: number;
  appName?: string;
}

export function GoalReachedModal({
  open,
  onClose,
  raised = 25000,
  backers = 127,
  appName = "Your App",
}: GoalReachedModalProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (open && !hasRun.current) {
      hasRun.current = true;
      runConfetti();
    }
  }, [open]);

  if (!open) return null;

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

          {/* Gradient header strip – GrowthStarter exact */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-8 text-white text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            </div>
            <div className="relative w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Goal Reached!</h2>
            <p className="text-white/90">
              Your app has been fully funded — ${raised.toLocaleString()} raised from {backers} backers!
            </p>
          </div>

          {/* Body – stats + actions */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                🚀
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{appName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">by your startup</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">Live</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">${(raised / 1000).toFixed(0)}k</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Raised</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{backers}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Backers</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl border-border">
                Share the News
              </Button>
              <Button className="flex-1 gs-gradient text-white rounded-xl" onClick={onClose}>
                Continue Exploring
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
