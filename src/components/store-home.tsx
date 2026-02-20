"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Tag,
  Users,
  DollarSign,
  LayoutGrid,
  List,
  Gift,
  Send,
  Rocket,
  FlaskConical,
  Brain,
  BarChart3,
  BookOpen,
  Puzzle,
  Briefcase,
  MessageCircle,
  Code,
  GraduationCap,
  ShoppingCart,
  Gamepad2,
  Palette,
  Heart,
  Baby,
  Sparkles,
  Newspaper,
  Megaphone,
  Stethoscope,
  Music,
  MapPin,
  Camera,
  CheckSquare,
  BookMarked,
  Shield,
  ShoppingBag,
  Share2,
  Trophy,
  Plane,
  Settings,
  CloudRain,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDealCard } from "@/components/app-deal-card";
import { WelcomeStorePop } from "@/components/welcome-store-pop";
import { useCompare } from "@/context/compare-context";
import { useStoreData } from "@/context/store-data-context";
import { getAppsSeekingTesters } from "@/lib/mock-data";
import type { App, Deal } from "@/types/store";

const APP_TYPES = [
  { value: "", label: "All types" },
  { value: "trial", label: "Trial" },
  { value: "beta", label: "Beta" },
  { value: "pilot", label: "Pilot" },
  { value: "validation", label: "Validation" },
  { value: "free", label: "Free" },
  { value: "demo", label: "Demo" },
  { value: "enterprise", label: "Enterprise" },
];

/** Full list for filter and Browse by category section */
const STORE_CATEGORIES = [
  "All",
  "AI",
  "AI & ML",
  "Analytics",
  "Books",
  "Browser extensions",
  "Business",
  "Communication",
  "CRM",
  "Developer tools",
  "Education",
  "E-commerce",
  "Entertainment",
  "Finance",
  "Food & drink",
  "Gaming",
  "Graphics & design",
  "Health & fitness",
  "Kids",
  "Lifestyle",
  "Magazines & newspapers",
  "Marketing",
  "Medical",
  "Music",
  "Navigation",
  "News",
  "Photo & video",
  "Productivity",
  "Reference",
  "Security",
  "Shopping",
  "Social networking",
  "Sports",
  "Travel",
  "Utilities",
  "Weather",
  "Development",
];
const CATEGORIES = STORE_CATEGORIES;

/** Icons for Browse by category section */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "AI": Brain,
  "AI & ML": Brain,
  "Analytics": BarChart3,
  "Books": BookOpen,
  "Browser extensions": Puzzle,
  "Business": Briefcase,
  "Communication": MessageCircle,
  "CRM": Users,
  "Developer tools": Code,
  "Development": Code,
  "Education": GraduationCap,
  "E-commerce": ShoppingCart,
  "Entertainment": Gamepad2,
  "Finance": DollarSign,
  "Food & drink": UtensilsCrossed,
  "Gaming": Gamepad2,
  "Graphics & design": Palette,
  "Health & fitness": Heart,
  "Kids": Baby,
  "Lifestyle": Sparkles,
  "Magazines & newspapers": Newspaper,
  "Marketing": Megaphone,
  "Medical": Stethoscope,
  "Music": Music,
  "Navigation": MapPin,
  "News": Newspaper,
  "Photo & video": Camera,
  "Productivity": CheckSquare,
  "Reference": BookMarked,
  "Security": Shield,
  "Shopping": ShoppingBag,
  "Social networking": Share2,
  "Sports": Trophy,
  "Travel": Plane,
  "Utilities": Settings,
  "Weather": CloudRain,
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Rating" },
  { value: "popular", label: "Popular" },
];

const STATS = [
  { label: "Apps Available", value: "156+", icon: Package },
  { label: "Active Deals", value: "89+", icon: Tag },
  { label: "Active Users", value: "2.5K+", icon: Users },
  { label: "Total Savings", value: "$2.5M+", icon: DollarSign },
];

type Tab = "all" | "apps" | "deals" | "submit";

export function StoreHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCompare, isInCompare, compareList, maxCompareItems } = useCompare();
  const { apps: storeApps, deals: storeDeals } = useStoreData();
  const tabParam = searchParams.get("tab") as Tab | null;
  const tab: Tab = tabParam && ["all", "apps", "deals", "submit"].includes(tabParam) ? tabParam : "all";
  const categoryParam = searchParams.get("category");
  const effectiveCategory =
    categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : null;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categoryValue = effectiveCategory ?? category;
  const [appType, setAppType] = useState("");
  const [seekingTestersOnly, setSeekingTestersOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const setTab = (t: Tab) => {
    if (t === "all") router.push("/");
    else router.push(`/?tab=${t}`);
  };

  const handleView = (item: App | Deal) => {
    if (item.type === "app") router.push(`/app/${item.id}`);
    else router.push(`/deal/${(item as Deal).id}`);
  };

  const featuredApps = storeApps.filter((a) => a.badges.includes("Featured")).slice(0, 4);
  const appsSeekingTesters = getAppsSeekingTesters(storeApps);
  const recentApps = [...storeApps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const hotDeals = storeDeals.slice(0, 4);

  const filteredApps = useMemo(() => {
    let list = [...storeApps];
    if (categoryValue !== "All") list = list.filter((a) => a.category === categoryValue);
    if (appType) list = list.filter((a) => a.appType === appType);
    if (seekingTestersOnly)
      list = list.filter(
        (a) => a.seekingBetaTesters || a.seekingPilotUsers || a.seekingValidationUsers
      );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.publisher.name.toLowerCase().includes(q)
      );
    }
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === "oldest") list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sort === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "popular") list.sort((a, b) => b.usersCount - a.usersCount);
    return list;
  }, [storeApps, categoryValue, appType, seekingTestersOnly, search, sort]);

  const filteredDeals = useMemo(() => {
    let list = [...storeDeals];
    if (categoryValue !== "All") list = list.filter((d) => d.category === categoryValue);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.publisher.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [storeDeals, categoryValue, search]);

  const setCategoryAndUrl = (c: string) => {
    setCategory(c);
    if (tab === "all" || tab === "apps") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      if (c === "All") params.delete("category");
      else params.set("category", c);
      router.push(`/?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WelcomeStorePop />

      {/* Hero – spec: teal gradient, title, CTAs (compact) */}
      <section className="relative overflow-hidden gs-hero-gradient text-white">
        <div className="relative mx-auto max-w-6xl px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Apps & Deals Marketplace
            </h1>
            <p className="mt-2 text-sm sm:text-base opacity-95">
              Discover software tools, trials, and exclusive startup discounts. Submit your app or deal to the community.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Button
                size="default"
                className="bg-white text-[var(--apps-primary)] hover:bg-white/90 rounded-xl dark:bg-gray-800 dark:text-teal-300 dark:hover:bg-gray-700"
                onClick={() => setTab("apps")}
              >
                <Package className="mr-2 h-4 w-4" />
                Browse Apps
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-white text-white hover:bg-white/20 rounded-xl"
                onClick={() => setTab("deals")}
              >
                <Tag className="mr-2 h-4 w-4" />
                View Deals
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-white text-white hover:bg-white/20 rounded-xl"
                onClick={() => { setTab("apps"); setSeekingTestersOnly(true); }}
              >
                <FlaskConical className="mr-2 h-4 w-4" />
                Beta & pilot programs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip – spec: 4 metrics with icons and gradient pills */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-muted/50 dark:bg-muted/30 px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gs-gradient text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Tabs: All Items | Apps | Deals | Submit */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
            {(
              [
                ["all", "All Items"],
                ["apps", "Apps"],
                ["deals", "Deals"],
                ["submit", "Submit"],
              ] as const
            ).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation ${
                  tab === t
                    ? "gs-gradient text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "submit" ? (
            /* Submit tab: two forms */
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold mb-2">Submit App</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  List your app for trials, beta, or validation. Review in 24–48 hours.
                </p>
                <Link href="/launch">
                  <Button className="w-full gs-gradient text-white">
                    <Rocket className="mr-2 h-4 w-4" />
                    Go to launch wizard
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold mb-2">Submit Deal</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Offer a discount, credits, or bundle to the GrowthLab community.
                </p>
                <Button className="w-full gs-gradient text-white" onClick={() => router.push("/submit-deal")}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit deal form
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar: category, app type, seeking testers, search, sort, view mode */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Category</span>
                  <select
                    value={categoryValue}
                    onChange={(e) => setCategoryAndUrl(e.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm min-w-[140px]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {(tab === "all" || tab === "apps") && (
                  <>
                    <select
                      value={appType}
                      onChange={(e) => setAppType(e.target.value)}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
                    >
                      {APP_TYPES.map((o) => (
                        <option key={o.value || "all"} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSeekingTestersOnly(!seekingTestersOnly)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5 ${
                        seekingTestersOnly
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "border-border bg-card text-muted-foreground hover:border-amber-500/50"
                      }`}
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      Seeking testers
                    </button>
                  </>
                )}
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`min-h-[44px] min-w-[44px] p-2 touch-manipulation ${viewMode === "grid" ? "bg-muted" : ""}`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`min-h-[44px] min-w-[44px] p-2 touch-manipulation ${viewMode === "list" ? "bg-muted" : ""}`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              {(tab === "all" || tab === "apps") && (
                <>
                  {tab === "all" && appsSeekingTesters.length > 0 && !seekingTestersOnly && (
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20">
                          <FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Beta & pilot programs</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-amber-600 dark:text-amber-400"
                          onClick={() => setSeekingTestersOnly(true)}
                        >
                          View all
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Apps actively looking for beta testers, pilot users, or validation participants.
                      </p>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {appsSeekingTesters.slice(0, 4).map((app) => (
                          <AppDealCard
                            key={app.id}
                            item={app}
                            onView={handleView}
                            onAddToCompare={addToCompare}
                            isInCompare={isInCompare}
                            compareLimitReached={compareList.length >= maxCompareItems}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                      {seekingTestersOnly ? "Apps seeking testers" : tab === "all" ? "Apps" : "All apps"}
                    </h2>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                          : "flex flex-col gap-4"
                      }
                    >
                      {filteredApps.map((app) => (
                        <AppDealCard
                          key={app.id}
                          item={app}
                          onView={handleView}
                          onAddToCompare={addToCompare}
                          isInCompare={isInCompare}
                          compareLimitReached={compareList.length >= maxCompareItems}
                        />
                      ))}
                    </div>
                  </div>
                  {tab === "all" && (
                    <div className="mb-8">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--apps-secondary)]/20">
                          <Gift className="h-5 w-5 text-[var(--apps-secondary)]" />
                        </div>
                        <h2 className="text-xl font-semibold">Hot Deals</h2>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {hotDeals.map((deal) => (
                          <AppDealCard key={deal.id} item={deal} onView={handleView} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {tab === "deals" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Deals</h2>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        : "flex flex-col gap-4"
                    }
                  >
                    {filteredDeals.map((deal) => (
                      <AppDealCard key={deal.id} item={deal} onView={handleView} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Browse by category — above footer */}
      <section className="border-t border-border bg-muted/20 dark:bg-muted/5">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="h-4 w-4 text-[var(--apps-primary)]" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Browse by category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {STORE_CATEGORIES.filter((c) => c !== "All").map((c) => {
              const Icon = CATEGORY_ICONS[c] ?? LayoutGrid;
              return (
                <Link
                  key={c}
                  href={`/?tab=apps&category=${encodeURIComponent(c)}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-[var(--apps-primary)] hover:bg-[var(--apps-primary)]/5 hover:text-[var(--apps-primary)] transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-[var(--apps-primary)]" aria-hidden />
                  <span>{c}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">© GrowthLab. Build. Connect. Scale.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/browse" className="text-[var(--apps-primary)] hover:underline">Browse</Link>
              <Link href="/launch" className="text-[var(--apps-primary)] hover:underline">Launch</Link>
              <Link href="/dashboard" className="text-[var(--apps-primary)] hover:underline">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
