"use client";

import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collectionDefinitions } from "@/lib/marketplace-data";
import { useStoreData } from "@/context/store-data-context";

export default function CollectionsPage() {
  const { apps, deals } = useStoreData();
  const featuredCount = apps.filter((a) => a.badges.includes("Featured")).length;
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Collections</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Curated sets of apps and deals. Save your own from the marketplace.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionDefinitions.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="block rounded-xl border border-border bg-card p-6 gs-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg gs-gradient text-white mb-3">
                <FolderOpen className="h-6 w-6" />
              </div>
              <h2 className="font-semibold text-foreground">{col.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{col.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {col.id === "editors-choice" && `${apps.length} apps`}
                {col.id === "trending-now" && `${featuredCount} apps`}
                {col.id === "new-noteworthy" && "Recently added"}
                {col.id === "best-free" && "Free trials & free forever"}
                {col.id === "startup-essentials" && `${apps.length + deals.length} items`}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm mb-2">Create your own collection from saved items.</p>
          <Link href="/?tab=all">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Browse marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
