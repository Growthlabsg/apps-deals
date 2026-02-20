"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "apps-deals-welcome-seen";
const CONFETTI_COLORS = ["#0F7377", "#00A884", "#FFD700", "#FF6B6B"];

function runConfetti() {
  confetti({
    particleCount: 20,
    spread: 60,
    origin: { y: 0.6 },
    colors: CONFETTI_COLORS,
  });
}

export function WelcomeStorePop() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
      runConfetti();
    }
  }, []);

  const onClose = () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

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
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-8 text-white text-center overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="relative w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Apps & Deals</h2>
            <p className="text-white/90">Discover and launch the next big apps on GrowthLab.</p>
          </div>
          <div className="p-6">
            <Button className="w-full gs-gradient text-white rounded-xl" onClick={onClose}>
              Continue Exploring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
