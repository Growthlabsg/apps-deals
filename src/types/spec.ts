/**
 * Data structures from Apps Store & Deals full spec.
 * Use for API responses and forms.
 */

export type AppLaunchType = "trial" | "beta" | "pilot" | "validation" | "free" | "demo" | "enterprise";
export type DealType = "discount" | "credits" | "free" | "bundle" | "partnership";

export interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
  appCount?: number;
  dealCount?: number;
}

export interface AppSummary {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  type: AppLaunchType;
  trialPeriod?: string;
  pricing?: string;
  rating?: number;
  downloads?: number;
  likes?: number;
  views?: number;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  category: string;
  status: string;
  lastUpdated?: string;
  createdAt?: string;
  verified?: boolean;
  tags?: string[];
}

export interface DealSummary {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  type: DealType;
  value?: number;
  discount?: number;
  deadline?: string;
  views?: number;
  likes?: number;
  claims?: number;
  featured?: boolean;
  trending?: boolean;
  exclusive?: boolean;
  limitedTime?: boolean;
  category: string;
  status: string;
  couponCode?: string;
  claimLimit?: number;
  claimedCount?: number;
  verified?: boolean;
}

/** Badge CSS classes by app type (spec section 2) */
export const APP_TYPE_BADGE: Record<AppLaunchType, { bg: string; text: string }> = {
  trial: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  beta: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  pilot: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  validation: { bg: "bg-violet-50 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
  demo: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  free: { bg: "bg-teal-50 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400" },
  enterprise: { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
};

/** Badge CSS classes by deal type (spec section 2) */
export const DEAL_TYPE_BADGE: Record<DealType, { bg: string; text: string }> = {
  discount: { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  credits: { bg: "bg-indigo-50 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
  free: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  partnership: { bg: "bg-pink-50 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400" },
  bundle: { bg: "bg-cyan-50 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-400" },
};
