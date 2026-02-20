/**
 * Central store data: only approved apps/deals appear in the marketplace.
 * Submissions go to pending; GrowthLab staff approve in Review; approved items join the live list.
 */

import type { App, Deal } from "@/types/store";
import type { Submission } from "@/types/marketplace";
import { mockApps, mockDeals } from "@/lib/mock-data";

const KEY_SUBMISSIONS = "growthlab_submissions";
const KEY_LIVE_APPS = "growthlab_live_apps";
const KEY_LIVE_DEALS = "growthlab_live_deals";

function safeJsonParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeJsonSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Only approved apps (status !== 'rejected' and status !== 'pending'). Mock apps are approved; live apps from storage are approved by definition. */
export function getApprovedApps(): App[] {
  const mock = mockApps.filter((a) => a.status !== "rejected" && a.status !== "pending");
  const live = safeJsonParse<App[]>(KEY_LIVE_APPS, []);
  return [...mock, ...live];
}

/** Apps that were submitted and approved (live list). Used to show "launch success" for developer. */
export function getLiveApps(): App[] {
  return safeJsonParse<App[]>(KEY_LIVE_APPS, []);
}

export function getApprovedDeals(): Deal[] {
  const mock = mockDeals.filter((d) => d.status !== "rejected" && d.status !== "pending");
  const live = safeJsonParse<Deal[]>(KEY_LIVE_DEALS, []);
  return [...mock, ...live];
}

/** All submissions (pending + approved/rejected for history). Merge with initial seed. */
export function getSubmissions(seed: Submission[]): Submission[] {
  const stored = safeJsonParse<Submission[]>(KEY_SUBMISSIONS, []);
  const byId = new Map<string, Submission>();
  seed.forEach((s) => byId.set(s.id, s));
  stored.forEach((s) => byId.set(s.id, s));
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function addSubmission(sub: Submission) {
  const list = safeJsonParse<Submission[]>(KEY_SUBMISSIONS, []);
  if (list.some((s) => s.id === sub.id)) return;
  list.unshift(sub);
  safeJsonSet(KEY_SUBMISSIONS, list);
}

/** Build App from submission (type app). */
function submissionToApp(s: Submission): App {
  const d = s.data as {
    title?: string;
    company?: string;
    description?: string;
    category?: string;
    longDescription?: string;
    screenshots?: string[];
    videos?: string[];
  };
  const app: App = {
    id: s.id,
    type: "app",
    name: d.title || s.title,
    description: d.description || s.description,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop",
    publisher: { id: `p-${s.id}`, name: d.company || s.company },
    usersCount: 0,
    dealsCount: 0,
    category: (d.category as string) || "Productivity",
    badges: ["New"],
    createdAt: s.submittedAt.slice(0, 10),
    status: "approved",
  };
  if (d.longDescription) app.longDescription = d.longDescription;
  if (d.screenshots?.length) app.screenshots = d.screenshots;
  if (d.videos?.length) app.videos = d.videos;
  return app;
}

/** Build Deal from submission (type deal). */
function submissionToDeal(s: Submission): Deal {
  const d = s.data as {
    title?: string;
    company?: string;
    description?: string;
    category?: string;
    type?: string;
    value?: string;
    discount?: string;
    deadline?: string;
    couponCode?: string;
  };
  const dealType = d.type as Deal["dealType"] | undefined;
  return {
    id: s.id,
    type: "deal",
    title: d.title || s.title,
    description: d.description || s.description,
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=240&fit=crop",
    appId: "",
    appName: d.company || s.company,
    publisher: { id: `p-${s.id}`, name: d.company || s.company },
    discount: d.discount || d.value || "Special offer",
    dealType: dealType || "discount",
    category: (d.category as string) || "General",
    badges: ["Deal"],
    createdAt: s.submittedAt.slice(0, 10),
    status: "approved",
    deadline: d.deadline,
    couponCode: d.couponCode,
  };
}

/** Approve a submission: add to live apps or deals and update submission status. */
export function approveSubmission(id: string, submissions: Submission[]): Submission[] {
  const sub = submissions.find((s) => s.id === id);
  if (!sub || sub.status === "approved") return submissions;

  const updated = submissions.map((s) =>
    s.id === id ? { ...s, status: "approved" as const } : s
  );
  safeJsonSet(KEY_SUBMISSIONS, updated);

  if (sub.type === "app") {
    const apps = safeJsonParse<App[]>(KEY_LIVE_APPS, []);
    if (!apps.some((a) => a.id === id)) {
      apps.push(submissionToApp({ ...sub, status: "approved" }));
      safeJsonSet(KEY_LIVE_APPS, apps);
    }
  } else {
    const deals = safeJsonParse<Deal[]>(KEY_LIVE_DEALS, []);
    if (!deals.some((d) => d.id === id)) {
      deals.push(submissionToDeal({ ...sub, status: "approved" }));
      safeJsonSet(KEY_LIVE_DEALS, deals);
    }
  }
  return updated;
}

export function rejectSubmission(id: string, submissions: Submission[], notes?: string): Submission[] {
  const updated = submissions.map((s) =>
    s.id === id
      ? { ...s, status: "rejected" as const, reviewNotes: notes ?? s.reviewNotes }
      : s
  );
  safeJsonSet(KEY_SUBMISSIONS, updated);
  return updated;
}

export function setSubmissionNeedsRevision(
  id: string,
  submissions: Submission[],
  notes?: string
): Submission[] {
  const updated = submissions.map((s) =>
    s.id === id
      ? { ...s, status: "needs_revision" as const, reviewNotes: notes ?? s.reviewNotes }
      : s
  );
  safeJsonSet(KEY_SUBMISSIONS, updated);
  return updated;
}

// --- Launch & milestone celebration persistence ---
const KEY_LAUNCH_SHOWN = "growthlab_launch_celebration_shown";
const KEY_MILESTONE_SHOWN = "growthlab_milestone_celebration_shown";

/** Mark launch celebration as shown for this app (so we don't show again on next login). */
export function setLaunchCelebrationShown(appId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY_LAUNCH_SHOWN);
    const set = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    set.add(appId);
    localStorage.setItem(KEY_LAUNCH_SHOWN, JSON.stringify([...set]));
  } catch {}
}

/** Check if we've already shown the launch celebration for this app. */
export function hasLaunchCelebrationShown(appId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(KEY_LAUNCH_SHOWN);
    const set = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    return set.has(appId);
  } catch {
    return false;
  }
}

/** Milestone thresholds (users/downloads) that trigger a celebration. */
export const LAUNCH_MILESTONE_THRESHOLDS = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000] as const;

/** Mark milestone celebration as shown for this app + milestone. */
export function setMilestoneCelebrationShown(appId: string, milestone: number): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY_MILESTONE_SHOWN);
    const map: Record<string, number[]> = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    if (!map[appId]) map[appId] = [];
    if (!map[appId].includes(milestone)) map[appId].push(milestone);
    map[appId].sort((a, b) => a - b);
    localStorage.setItem(KEY_MILESTONE_SHOWN, JSON.stringify(map));
  } catch {}
}

/** Get which milestones we've already shown for this app. */
export function getMilestoneCelebrationsShown(appId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_MILESTONE_SHOWN);
    const map: Record<string, number[]> = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    return map[appId] ?? [];
  } catch {
    return [];
  }
}
