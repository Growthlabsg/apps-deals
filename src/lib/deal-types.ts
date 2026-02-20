import type { DealType } from "@/types/store";

export const DEAL_TYPE_OPTIONS: { value: DealType; label: string; placeholder: string }[] = [
  { value: "discount", label: "Discount", placeholder: "e.g. 50% off or $20 off" },
  { value: "free_trial", label: "Free trial", placeholder: "e.g. 30 days free, no card" },
  { value: "credits", label: "Free credits", placeholder: "e.g. $50 credits or 1000 credits" },
  { value: "free_download", label: "Free download", placeholder: "e.g. Free license or Free plan" },
  { value: "free", label: "Free offer", placeholder: "e.g. Free forever or Free tier" },
  { value: "bundle", label: "Bundle", placeholder: "e.g. 3 tools for price of 1" },
  { value: "partnership", label: "Partnership", placeholder: "e.g. Exclusive partner offer" },
];

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  discount: "Discount",
  free_trial: "Free trial",
  credits: "Free credits",
  free_download: "Free download",
  free: "Free",
  bundle: "Bundle",
  partnership: "Partnership",
};

/** Badge background/text classes by deal type (minimal, matches design system) */
export const DEAL_TYPE_BADGE_CLASS: Record<DealType, string> = {
  discount: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-0",
  free_trial: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0",
  credits: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-0",
  free_download: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-0",
  free: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0",
  bundle: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-0",
  partnership: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-0",
};

export function getDealTypeLabel(dealType?: DealType): string {
  return dealType ? DEAL_TYPE_LABELS[dealType] : "Deal";
}
