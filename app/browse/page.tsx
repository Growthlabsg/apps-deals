"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDealCard } from "@/components/app-deal-card";
import { useStoreData } from "@/context/store-data-context";
import type { App, Deal } from "@/types/store";
import { Search, Filter } from "lucide-react";

const CATEGORIES = ["Mobile Apps", "Web/SaaS", "AI Tools", "Productivity", "Fintech", "Health", "Deals"];
const PRICING = ["Free", "Paid", "Freemium"];
const STAGE = ["Pre-launch", "Live", "Funded"];

export default function BrowsePage() {
  const router = useRouter();
  const { apps, deals } = useStoreData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [pricing, setPricing] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  const all = useMemo(() => [...apps, ...deals], [apps, deals]);
  const filtered = useMemo(() => {
    return all.filter((item) => {
      const q = query.toLowerCase();
      if (q && !item.description.toLowerCase().includes(q) &&
          !(item.type === "app" ? (item as App).name : (item as Deal).title).toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [all, query]);

  const handleView = (item: App | Deal) => {
    if (item.type === "app") router.push(`/app/${(item as App).id}`);
    else router.push(`/deal/${(item as Deal).id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-foreground">Browse & Discover</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 rounded-lg border border-border bg-card p-4 shadow-sm lg:w-64">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(category === c ? null : c)}
                      className={`rounded-lg border px-3 py-2 min-h-[44px] text-xs touch-manipulation ${
                        category === c
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Pricing</p>
                <div className="space-y-1">
                  {PRICING.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricing(pricing === p ? null : p)}
                      className={`block w-full rounded-lg px-3 py-3 min-h-[44px] text-left text-sm touch-manipulation ${
                        pricing === p ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Stage</p>
                <div className="space-y-1">
                  {STAGE.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(stage === s ? null : s)}
                      className={`block w-full rounded-lg px-3 py-3 min-h-[44px] text-left text-sm touch-manipulation ${
                        stage === s ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid + search */}
          <div className="flex-1">
            <div className="mb-6 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search apps, SaaS, AI tools, deals…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-lg border-input pl-9"
                />
              </div>
              <Link href="/launch">
                <Button className="rounded-lg gs-gradient text-white hover:opacity-90">
                  Launch Your App
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <AppDealCard key={item.id} item={item} onView={handleView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
