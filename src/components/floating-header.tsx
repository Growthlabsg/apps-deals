"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Rocket,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/marketplace-data";

const mainNav = [
  { href: "/", label: "Discover" },
  { href: "/browse", label: "Apps & Deals" },
  { href: "/launch", label: "Launch" },
  { href: "/my-launches", label: "Profile" },
];

const storeNav = [
  { href: "/", label: "All", tab: "all" },
  { href: "/?tab=apps", label: "Apps", tab: "apps" },
  { href: "/?tab=deals", label: "Deals", tab: "deals" },
  { href: "/?tab=submit", label: "Submit", tab: "submit" },
];

const moreNav = [
  { href: "/collections", label: "Collections" },
  { href: "/compare", label: "Compare" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/review", label: "Review" },
  { href: "/settings", label: "Settings" },
];

const pillLink =
  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all";
const pillActive = "gs-gradient text-white shadow-md";
const pillInactive =
  "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white";

export function FloatingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = pathname === "/" ? (searchParams.get("tab") || "all") : "";
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Desktop / tablet: fixed top pill bar with logo */}
      <header
        className="fixed top-4 left-0 right-0 z-50 px-4 animate-in fade-in slide-in-from-top-2 duration-300"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          {/* Centred pill – nav + store + more + actions */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
              {/* Main nav */}
              {mainNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href === "/" && pathname === "/" && !searchParams.get("tab"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      pillLink,
                      active ? pillActive : pillInactive
                    )}
                  >
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden">{item.label}</span>
                  </Link>
                );
              })}

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-0.5" />

              {/* Store tabs (All, Apps, Deals, Submit) */}
              {storeNav.map((item) => {
                const linkTab = item.tab ?? (item.href === "/" ? "all" : (item.href.match(/tab=(\w+)/)?.[1] ?? "all"));
                const active = pathname === "/" && tab === linkTab;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      pillLink,
                      active ? pillActive : pillInactive
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className={cn(
                    pillLink,
                    moreOpen ? "bg-slate-100 dark:bg-slate-700" : pillInactive
                  )}
                  onClick={() => setMoreOpen(!moreOpen)}
                >
                  More
                  <ChevronDown className={cn("h-4 w-4", moreOpen && "rotate-180")} />
                </button>
                {moreOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      aria-hidden
                      onClick={() => setMoreOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 z-10 w-48 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                      {moreNav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400"
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-0.5" />

              {/* Theme */}
              <button
                type="button"
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((o) => !o)}
                  className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      aria-hidden
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 z-10 w-80 max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Notifications</span>
                        <Link
                          href="/dashboard"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-primary hover:underline"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="overflow-y-auto max-h-[60vh]">
                        {mockNotifications.length === 0 ? (
                          <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
                        ) : (
                          mockNotifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.link || "/dashboard"}
                              onClick={() => setNotificationsOpen(false)}
                              className={cn(
                                "block px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                !n.read && "bg-primary/5 dark:bg-primary/10"
                              )}
                            >
                              <p className="text-sm font-medium text-foreground">{n.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                              <p className="text-xs text-muted-foreground/80 mt-1">{formatNotificationDate(n.createdAt)}</p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Launch app CTA */}
              <Link href="/launch" className="ml-1">
                <span className="flex items-center gap-1.5 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
                  <Rocket className="h-4 w-4" />
                  <span className="hidden xl:inline">Launch app</span>
                </span>
              </Link>
            </div>
          </div>

        </div>

        {/* Tablet: compact pill in same row as logo */}
        <div className="hidden md:flex lg:hidden flex-1 justify-center min-w-0">
          <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-full px-2 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
            {mainNav.map((item) => {
              const active = pathname === item.href || (item.href === "/" && pathname === "/" && !searchParams.get("tab"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(pillLink, active ? pillActive : pillInactive)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-600" />
            {storeNav.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className={cn(pillLink, pillInactive)}>
                {item.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-600" />
            <button type="button" onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Theme">
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </button>
            <Link href="/dashboard" className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link href="/launch">
              <span className="flex items-center gap-1 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium">
                <Rocket className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

      </header>

      {/* Mobile: fixed top bar (app-like) — logo + menu; spacer for content */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 min-h-[56px] px-4 gs-glass border-b border-border mobile-top-safe">
        <Link href="/" className="gs-gradient-text text-lg font-bold tracking-tight">
          Apps & Deals
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="touch-target flex items-center justify-center w-12 h-12 -mr-2 rounded-full text-foreground hover:bg-muted active:bg-muted/80 transition-colors"
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 top-14"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 right-0 top-14 z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto gs-glass border-b border-border shadow-xl animate-in slide-in-from-top-2 duration-200 mobile-top-safe">
            <nav className="p-3 space-y-0.5" aria-label="Mobile menu">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all touch-target",
                    pathname === item.href || (item.href === "/" && pathname === "/")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              {storeNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted touch-target"
                >
                  {item.label}
                </Link>
              ))}
              {moreNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted touch-target"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted touch-target"
              >
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted touch-target"
              >
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
                Theme
              </button>
              <Link
                href="/launch"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 mt-2 gs-gradient text-white rounded-xl text-sm font-medium touch-target"
              >
                <Rocket className="h-5 w-5" />
                Launch app
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Spacer so content is not under the floating header */}
      <div className="h-14 lg:h-20 md:h-24 shrink-0 mobile-top-safe" aria-hidden />

      {/* Scroll to top – show when user has scrolled */}
      <ScrollToTop />
    </>
  );
}

function formatNotificationDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[5.5rem] left-4 lg:bottom-4 w-12 h-12 min-h-[44px] min-w-[44px] bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-all z-40 animate-in fade-in slide-in-from-bottom-2 duration-200 touch-manipulation"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
