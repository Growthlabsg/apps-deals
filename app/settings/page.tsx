"use client";

import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Theme, notifications, and privacy.
        </p>
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5" />
              General
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark mode</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!isDark ? "default" : "outline"}
                  className={!isDark ? "gs-gradient text-white" : ""}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={isDark ? "default" : "outline"}
                  className={isDark ? "gs-gradient text-white" : ""}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5" />
              Notifications
            </h2>
            <p className="text-sm text-muted-foreground">Email and push preferences (wire to API).</p>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              Privacy
            </h2>
            <p className="text-sm text-muted-foreground">Profile visibility and data (wire to API).</p>
          </section>
        </div>
      </div>
    </div>
  );
}
