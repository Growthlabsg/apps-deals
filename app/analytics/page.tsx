"use client";

import { useState } from "react";
import {
  BarChart3,
  Package,
  Tag,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  mockAnalyticsData,
  mockAppPerformance,
  mockDealPerformance,
} from "@/lib/marketplace-data";

const TIME_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const data = mockAnalyticsData;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Overview of apps, deals, engagement, and categories.
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {TIME_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total apps", value: data.totalApps.toLocaleString(), icon: Package },
            { label: "Total deals", value: data.totalDeals.toLocaleString(), icon: Tag },
            { label: "Active users", value: data.totalUsers.toLocaleString(), icon: Users },
            { label: "Total savings", value: `$${(data.totalSavings / 1e6).toFixed(1)}M`, icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Engagement
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <p className="text-muted-foreground">Page views</p>
              <p className="text-xl font-semibold">{data.pageViews.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Unique visitors</p>
              <p className="text-xl font-semibold">{data.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Download rate</p>
              <p className="text-xl font-semibold">{data.downloadRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg time on page</p>
              <p className="text-xl font-semibold">{data.avgTimeOnPage}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bounce rate</p>
              <p className="text-xl font-semibold">{data.bounceRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Return visitors</p>
              <p className="text-xl font-semibold">{data.returnVisitors}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Top apps</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">App</th>
                    <th className="text-right p-3 font-medium">Downloads</th>
                    <th className="text-right p-3 font-medium">Rating</th>
                    <th className="text-right p-3 font-medium">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppPerformance.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="p-3 font-medium">{row.title}</td>
                      <td className="p-3 text-right">{row.downloads.toLocaleString()}</td>
                      <td className="p-3 text-right">{row.rating}</td>
                      <td className="p-3 text-right">{row.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Top deals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Deal</th>
                    <th className="text-right p-3 font-medium">Views</th>
                    <th className="text-right p-3 font-medium">Redemptions</th>
                    <th className="text-right p-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDealPerformance.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="p-3 font-medium">{row.title}</td>
                      <td className="p-3 text-right">{row.views.toLocaleString()}</td>
                      <td className="p-3 text-right">{row.redemptions}</td>
                      <td className="p-3 text-right">${row.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
