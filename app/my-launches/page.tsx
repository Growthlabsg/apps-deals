"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { mockApps } from "@/lib/mock-data";
import { ArrowRight, TrendingUp, Users, Eye, BarChart3 } from "lucide-react";

export default function MyLaunchesPage() {
  const myApps = mockApps.slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Launches</h1>
        <p className="text-muted-foreground mb-8">Track your apps, funding, and backers.</p>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[
            { label: "Raised", value: "$12,450", icon: BarChart3, color: "text-primary" },
            { label: "Backers", value: "48", icon: Users, color: "text-primary" },
            { label: "Visitors", value: "1.2k", icon: Eye, color: "text-amber-600 dark:text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">Your apps</h2>
        <div className="space-y-4">
          {myApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={app.imageUrl} alt={app.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.usersCount} users • {app.dealsCount} deals</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">Live</span>
                <Link href={`/app/${app.id}`}>
                  <Button size="sm" variant="outline" className="rounded-lg">
                    View
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
          <TrendingUp className="mx-auto h-10 w-10 text-primary" />
          <h3 className="mt-2 font-semibold text-foreground">Launch another app</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get funding and reach 2,500+ founders.</p>
          <Link href="/launch">
            <Button className="mt-4 rounded-xl gs-gradient text-white hover:opacity-90">
              Launch Your App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
