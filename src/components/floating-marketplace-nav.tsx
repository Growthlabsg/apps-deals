"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutGrid,
  Package,
  Tag,
  Send,
  FolderOpen,
  GitCompare,
  LayoutDashboard,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronUp,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "All", icon: LayoutGrid },
  { href: "/?tab=apps", label: "Apps", icon: Package },
  { href: "/?tab=deals", label: "Deals", icon: Tag },
  { href: "/?tab=submit", label: "Submit", icon: Send },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function FloatingMarketplaceNav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = pathname === "/" ? (searchParams.get("tab") || "all") : "";
  const isMarketplace = pathname === "/" || pathname === "/browse";

  if (!isMarketplace) return null;

  return (
    <>
      {/* Desktop: sticky pill */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="gs-glass border border-border rounded-full shadow-lg px-2 py-2 flex items-center gap-1 transition-all duration-300">
          {items.slice(0, 4).map(({ href, label, icon: Icon }) => {
            const linkTab = href === "/" ? "all" : (href.match(/tab=(\w+)/)?.[1] ?? "all");
            const active = pathname === "/" && tab === linkTab;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                  active ? "gs-gradient text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <div className="w-px h-6 bg-border mx-1" />
          {items.slice(4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile: FAB + bottom sheet */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full gs-gradient text-white shadow-lg flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 gs-glass border-t border-border rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="font-semibold">Apps & Deals</span>
              <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-muted">
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 grid grid-cols-2 gap-2">
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted text-sm font-medium"
                >
                  <Icon className="h-5 w-5 text-[var(--apps-primary)]" />
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted text-sm font-medium col-span-2"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                Theme
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Scroll to top - optional */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 md:bottom-6 md:right-6 w-10 h-10 rounded-full border border-border bg-card shadow flex items-center justify-center text-muted-foreground hover:text-foreground z-40"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}
