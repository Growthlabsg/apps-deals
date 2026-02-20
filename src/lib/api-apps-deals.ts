/**
 * API client for Apps Store & Deals micro-app integration.
 * Base URL: NEXT_PUBLIC_APPS_DEALS_API (e.g. https://growthlab.com/api/apps-deals)
 * When not set, app uses mock data.
 */

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_APPS_DEALS_API ?? "") : process.env.NEXT_PUBLIC_APPS_DEALS_API ?? "";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: { total: number; page: number; limit: number; totalPages: number };
  error?: string;
  message?: string;
}

export interface ListParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AppsParams extends ListParams {
  category?: string;
  type?: string;
  featured?: boolean;
  verified?: boolean;
  trending?: boolean;
  minRating?: number;
}

export interface DealsParams extends ListParams {
  category?: string;
  type?: string;
  featured?: boolean;
  exclusive?: boolean;
  notExpired?: boolean;
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (!BASE) {
    return { success: false, error: "API base URL not configured" };
  }
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: json.message || res.statusText };
    return json as ApiResponse<T>;
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : "";
}

/** GET /apps */
export async function listApps(params: AppsParams = {}) {
  return fetchApi<unknown[]>(`/apps${qs(params as Record<string, string | number | boolean | undefined>)}`);
}

/** GET /apps/[id] */
export async function getApp(id: string) {
  return fetchApi<unknown>(`/apps/${id}`);
}

/** GET /deals */
export async function listDeals(params: DealsParams = {}) {
  return fetchApi<unknown[]>(`/deals${qs(params as Record<string, string | number | boolean | undefined>)}`);
}

/** GET /deals/[id] */
export async function getDeal(id: string) {
  return fetchApi<unknown>(`/deals/${id}`);
}

/** POST /deals/[id]/claim */
export async function claimDeal(id: string, body: { userId?: string; email?: string }) {
  return fetchApi<unknown>(`/deals/${id}/claim`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /categories */
export async function listCategories() {
  return fetchApi<{ id: string; name: string; slug?: string; appCount?: number; dealCount?: number }[]>(`/categories`);
}

/** GET /startups/[id] */
export async function getStartupProfile(startupId: string) {
  return fetchApi<unknown>(`/startups/${startupId}`);
}

/** GET /startups/[id]/badge */
export async function getStartupBadge(startupId: string) {
  return fetchApi<{ hasApps: boolean; appCount: number; hasDeals: boolean; dealCount: number; isVerified?: boolean; averageRating?: number }>(`/startups/${startupId}/badge`);
}

/** POST /apps (submit app) */
export async function submitApp(body: unknown) {
  return fetchApi<{ id: string }>("/apps", { method: "POST", body: JSON.stringify(body) });
}

/** POST /deals (submit deal) */
export async function submitDeal(body: unknown) {
  return fetchApi<{ id: string }>("/deals", { method: "POST", body: JSON.stringify(body) });
}

/** Check if API is configured */
export function isApiConfigured(): boolean {
  return Boolean(BASE);
}
