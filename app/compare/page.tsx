"use client";

import Link from "next/link";
import { useCompare } from "@/context/compare-context";
import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const { compareList, clearCompare } = useCompare();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Compare Apps</h1>
            <p className="text-muted-foreground text-sm">
              Select up to 4 apps to compare features, pricing, and ratings.
            </p>
          </div>
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompare}>
              Clear all
            </Button>
          )}
        </div>
        {compareList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <GitCompare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No apps selected for comparison.</p>
            <Link href="/?tab=apps">
              <Button className="gs-gradient text-white">Add from marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-foreground">Feature</th>
                  {compareList.map((app) => (
                    <th key={app.id} className="text-left p-4 font-medium text-foreground min-w-[140px]">
                      {app.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Category</td>
                  {compareList.map((app) => (
                    <td key={app.id} className="p-4">{app.category}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Users</td>
                  {compareList.map((app) => (
                    <td key={app.id} className="p-4">{app.usersCount.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Deals</td>
                  {compareList.map((app) => (
                    <td key={app.id} className="p-4">{app.dealsCount}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Publisher</td>
                  {compareList.map((app) => (
                    <td key={app.id} className="p-4">{app.publisher.name}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Link</td>
                  {compareList.map((app) => (
                    <td key={app.id} className="p-4">
                      <Link href={`/app/${app.id}`} className="text-primary hover:underline text-xs">
                        View app
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
