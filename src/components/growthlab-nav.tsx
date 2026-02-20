"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Bell, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Discover", active: true },
  { href: "/browse", label: "Apps & Deals" },
  { href: "/launch", label: "Launch" },
  { href: "/my-launches", label: "Profile" },
];

export function GrowthLabNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const isDiscover = pathname === "/";
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border gs-glass"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo – same as GrowthStarter */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gs-gradient-text">GrowthLab</h1>
              <p className="text-xs text-slate-500 hidden sm:block dark:text-slate-400">
                Apps & Deals
              </p>
            </div>
          </Link>

          {/* Nav – active state with teal */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                isDiscover
                  ? "gs-gradient text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              )}
            >
              Discover
            </Link>
            <Link
              href="/browse"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                pathname === "/browse"
                  ? "gs-gradient text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              )}
            >
              Apps & Deals
            </Link>
            <Link
              href="/launch"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Launch
            </Link>
            <Link
              href="/my-launches"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Profile
            </Link>
          </nav>

          {/* Right: theme, notifications, CTA */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              onClick={toggleTheme}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 relative"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/launch" className="hidden sm:block">
              <Button
                size="sm"
                className="gs-gradient hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
              >
                <Rocket className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Launch app</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium",
                  pathname === item.href || (item.active && pathname === "/")
                    ? "gs-gradient text-white"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/launch" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button size="sm" className="w-full gs-gradient text-white rounded-full">
                <Rocket className="h-4 w-4 mr-2" />
                Launch app
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
