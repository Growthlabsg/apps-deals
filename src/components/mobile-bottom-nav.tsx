"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, Package, Rocket, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Discover", icon: LayoutGrid },
  { href: "/browse", label: "Store", icon: Package },
  { href: "/launch", label: "Launch", icon: Rocket },
  { href: "/my-launches", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const tab = isHome ? (searchParams.get("tab") || "all") : "";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border safe-area-pb"
      role="navigation"
      aria-label="Main"
    >
      <div className="flex items-center justify-around h-16 min-h-[56px]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href && (href !== "/" || !tab || tab === "all");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 rounded-lg transition-colors touch-manipulation min-h-[48px]",
                active
                  ? "text-[var(--apps-primary)] dark:text-teal-400 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-6 w-6 shrink-0" aria-hidden />
              <span className="text-xs truncate max-w-[72px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
