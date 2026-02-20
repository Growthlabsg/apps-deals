"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  Tag,
  Send,
  Package,
  Bell,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockCurrentUser,
  mockNotifications,
  mockActivityLog,
} from "@/lib/marketplace-data";
import { useStoreData } from "@/context/store-data-context";

type Tab = "overview" | "saved" | "claimed" | "submitted" | "notifications" | "activity";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { apps, deals } = useStoreData();

  const savedApps = apps.filter((a) => mockCurrentUser.savedApps.includes(a.id));
  const claimedDealsList = mockCurrentUser.claimedDeals;
  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Your saved apps, claimed deals, and submissions.
        </p>

        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
          {(
            [
              ["overview", "Overview", LayoutDashboard],
              ["saved", "Saved", Heart],
              ["claimed", "Claimed", Tag],
              ["submitted", "Submitted", Send],
              ["notifications", "Notifications", Bell],
              ["activity", "Activity", Activity],
            ] as const
          ).map(([t, label, Icon]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t ? "gs-gradient text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {t === "notifications" && unreadNotifications.length > 0 && (
                <span className="bg-white/20 rounded-full px-1.5 text-xs">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/collections"
              className="rounded-xl border border-border bg-card p-6 gs-card-hover flex items-center gap-4 block"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg gs-gradient text-white">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Saved</p>
                <p className="text-sm text-muted-foreground">{savedApps.length} apps</p>
              </div>
            </Link>
            <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Claimed deals</p>
                <p className="text-sm text-muted-foreground">{claimedDealsList.length}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {mockCurrentUser.submittedApps.length + mockCurrentUser.submittedDeals.length} items
                </p>
              </div>
            </div>
            <Link
              href="/launch"
              className="rounded-xl border border-border bg-card p-6 gs-card-hover flex items-center gap-4 block"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Launch app</p>
                <p className="text-sm text-muted-foreground">Submit a new app</p>
              </div>
            </Link>
          </div>
        )}

        {tab === "saved" && (
          <div className="space-y-4">
            {savedApps.length === 0 ? (
              <p className="text-muted-foreground">No saved apps. Browse the marketplace to save.</p>
            ) : (
              savedApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/app/${app.id}`}
                  className="block rounded-xl border border-border bg-card p-4 hover:bg-muted/50"
                >
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.publisher.name} • {app.category}</p>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "claimed" && (
          <div className="space-y-4">
            {claimedDealsList.length === 0 ? (
              <p className="text-muted-foreground">No claimed deals yet.</p>
            ) : (
              claimedDealsList.map((c) => {
                const deal = deals.find((d) => d.id === c.dealId);
                return (
                  <div
                    key={c.dealId}
                    className="rounded-xl border border-border bg-card p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{deal?.title ?? c.dealId}</p>
                      <p className="text-sm text-muted-foreground">
                        Claimed {new Date(c.claimedAt).toLocaleDateString()} • Code: {c.couponCode ?? "—"}
                      </p>
                    </div>
                    <Link href={`/deal/${c.dealId}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "submitted" && (
          <div className="space-y-4">
            {mockCurrentUser.submittedApps.length === 0 && mockCurrentUser.submittedDeals.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet. Submit an app or deal from the marketplace.</p>
            ) : (
              <>
                {mockCurrentUser.submittedApps.map((id) => {
                  const app = apps.find((a) => a.id === id);
                  return app ? (
                    <div key={id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{app.name}</p>
                        <p className="text-sm text-muted-foreground">App • Pending review</p>
                      </div>
                      <Link href={`/app/${id}`}><Button size="sm" variant="outline">View</Button></Link>
                    </div>
                  ) : null;
                })}
                {mockCurrentUser.submittedDeals.map((id) => {
                  const deal = deals.find((d) => d.id === id);
                  return deal ? (
                    <div key={id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{deal.title}</p>
                        <p className="text-sm text-muted-foreground">Deal • Pending review</p>
                      </div>
                      <Link href={`/deal/${id}`}><Button size="sm" variant="outline">View</Button></Link>
                    </div>
                  ) : null;
                })}
              </>
            )}
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-2">
            {mockNotifications.length === 0 ? (
              <p className="text-muted-foreground">No notifications.</p>
            ) : (
              mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border border-border bg-card p-4 ${!n.read ? "border-primary/30" : ""}`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {n.link && (
                    <Link href={n.link} className="text-sm text-primary hover:underline mt-2 inline-block">
                      View
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-2">
            {mockActivityLog.length === 0 ? (
              <p className="text-muted-foreground">No recent activity.</p>
            ) : (
              mockActivityLog.map((a) => (
                <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
