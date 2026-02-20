"use client";

import Link from "next/link";
import { useCompare } from "@/context/compare-context";
import { GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, maxCompareItems } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-40",
        "bottom-[5.5rem] lg:bottom-4",
        "bg-card border border-border rounded-full shadow-lg px-3 py-2",
        "flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
      )}
    >
      <GitCompare className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm font-medium text-foreground">
        {compareList.length} of {maxCompareItems} selected
      </span>
      <div className="flex items-center gap-1">
        {compareList.map((app) => (
          <span
            key={app.id}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium"
          >
            {app.name}
            <button
              type="button"
              onClick={() => removeFromCompare(app.id)}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20"
              aria-label={`Remove ${app.name} from compare`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Link href="/compare">
        <Button size="sm" className="rounded-full gs-gradient text-white h-8">
          Compare
        </Button>
      </Link>
      <Button size="sm" variant="ghost" className="rounded-full h-8" onClick={clearCompare}>
        Clear
      </Button>
    </div>
  );
}
