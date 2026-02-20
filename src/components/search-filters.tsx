"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Most popular" },
];

interface SearchFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  dealsOnly: boolean;
  onDealsOnlyChange: (v: boolean) => void;
}

export function SearchFilters({
  query,
  onQueryChange,
  sort,
  onSortChange,
  dealsOnly,
  onDealsOnlyChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search apps and deals..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">Sort:</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSortChange(opt.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              sort === opt.id
                ? "bg-[#0F7377]/10 text-[#0F7377] border border-[#0F7377]/30 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
            )}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => onDealsOnlyChange(!dealsOnly)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5",
            dealsOnly
              ? "bg-[#0F7377]/10 text-[#0F7377] border border-[#0F7377]/30 dark:bg-teal-500/20 dark:text-teal-400"
              : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Deals only
        </button>
      </div>
    </div>
  );
}
