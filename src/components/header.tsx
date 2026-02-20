"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  User,
  Moon,
  Sun,
  LayoutGrid,
  Sparkles,
  Tag,
  LayoutList,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const quickFilters = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "new", label: "New", icon: LayoutGrid },
  { id: "deals", label: "Deals", icon: Tag },
  { id: "categories", label: "Categories", icon: LayoutList },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border gs-glass">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="gs-gradient-text text-xl">GrowthLab</span>
          <span className="text-muted-foreground hidden sm:inline">Apps & Deals</span>
        </Link>

        <div className="flex-1 flex items-center gap-2 max-w-xl mx-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search apps and deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background/80 border-border"
          />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {quickFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeFilter === f.id
                  ? "bg-[#0F7377]/10 text-[#0F7377] border border-[#0F7377]/30 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/">My apps</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">My deals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
