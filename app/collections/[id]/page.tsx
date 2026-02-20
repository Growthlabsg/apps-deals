"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppDealCard } from "@/components/app-deal-card";
import { useStoreData } from "@/context/store-data-context";
import { collectionDefinitions } from "@/lib/marketplace-data";
import type { App, Deal } from "@/types/store";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || "";
  const { apps, deals } = useStoreData();
  const def = collectionDefinitions.find((c) => c.id === id);

  const items: (App | Deal)[] = (() => {
    if (id === "editors-choice") return apps.filter((a) => a.badges.includes("Featured")).slice(0, 12);
    if (id === "trending-now") return apps.filter((a) => a.badges.includes("Featured")).slice(0, 8);
    if (id === "new-noteworthy") return [...apps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
    if (id === "best-free") return apps.filter((a) => a.appType === "free" || a.trialPeriod?.toLowerCase().includes("free")).slice(0, 8);
    if (id === "startup-essentials") return [...apps.slice(0, 6), ...deals.slice(0, 4)];
    return [];
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/collections">
          <Button variant="ghost" size="sm" className="mb-4 min-h-[44px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Collections
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">{def?.name ?? id}</h1>
        <p className="text-muted-foreground text-sm mb-6">{def?.description ?? `Collection: ${id}`}</p>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No items in this collection. Browse the marketplace to add apps or deals.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <AppDealCard
                key={item.id}
                item={item}
                onView={() => router.push(item.type === "app" ? `/app/${item.id}` : `/deal/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
