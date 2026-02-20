/**
 * Marketplace types aligned with reference (GrowthLab platform apps-deals).
 * Use for API, forms, compare, dashboard, analytics, submissions.
 */

export type AppLaunchType =
  | "trial"
  | "beta"
  | "pilot"
  | "validation"
  | "free"
  | "demo"
  | "enterprise";
export type DealType =
  | "discount"
  | "credits"
  | "free"
  | "bundle"
  | "partnership";
export type SubmissionStatus =
  | "draft"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_revision"
  | "published";

export interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

/** Full app (reference shape) – for compare, detail, API */
export interface AppFull {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  longDescription?: string;
  type: AppLaunchType;
  trialPeriod?: string;
  pricing?: string;
  rating: number;
  downloads: number;
  likes: number;
  views: number;
  featured: boolean;
  trending?: boolean;
  isNew?: boolean;
  category: string;
  status: "active" | "inactive" | "coming_soon";
  lastUpdated: string;
  createdAt?: string;
  website?: string;
  supportEmail?: string;
  tags: string[];
  features: string[];
  screenshots: string[];
  reviews: number;
  reviewsList?: Review[];
  verified: boolean;
  integrations?: string[];
  platforms?: string[];
  faqs?: { question: string; answer: string }[];
}

/** Full deal (reference shape) */
export interface DealFull {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  type: DealType;
  value: number;
  discount: number;
  location: string;
  deadline: string;
  views: number;
  likes: number;
  claims?: number;
  featured: boolean;
  trending?: boolean;
  exclusive?: boolean;
  category: string;
  status: "active" | "inactive" | "expired" | "coming_soon";
  requirements: string[];
  benefits: string[];
  couponCode: string;
  redemptionSteps?: string[];
  terms?: string;
  termsUrl?: string;
  verified: boolean;
  claimLimit?: number;
  claimedCount?: number;
  faqs?: { question: string; answer: string }[];
}

export interface AppFormData {
  title: string;
  company: string;
  description: string;
  /** Full description (multiple paragraphs). Optional. */
  longDescription?: string;
  /** Screenshot image URLs (one per line or comma-separated). Optional. */
  screenshots?: string[];
  /** Video URLs (YouTube, Vimeo, or direct .mp4). Optional. */
  videos?: string[];
  website: string;
  contactEmail: string;
  contactPhone: string;
  type: string;
  category: string;
  trialPeriod: string;
  pricing: string;
  targetAudience: string;
  keyFeatures: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface DealFormData {
  title: string;
  company: string;
  description: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  type: string;
  value: string;
  discount: string;
  deadline: string;
  location: string;
  category: string;
  requirements: string;
  benefits: string;
  couponCode: string;
  terms: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface Submission {
  id: string;
  type: "app" | "deal";
  title: string;
  company: string;
  description: string;
  status: SubmissionStatus;
  priority: "low" | "normal" | "high" | "urgent";
  submittedAt: string;
  submittedBy: string;
  submitterEmail: string;
  reviewNotes: string;
  data: AppFormData | DealFormData;
  reviewHistory?: { status: string; notes: string; reviewedBy: string; timestamp: string }[];
}

export interface ClaimedDeal {
  dealId: string;
  claimedAt: string;
  status: "active" | "used" | "expired";
  couponCode?: string;
}

export interface Notification {
  id: string;
  type: "submission_update" | "deal_expiring" | "new_app" | "review" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  type: "app_submitted" | "deal_submitted" | "app_approved" | "deal_approved" | "deal_claimed" | "review_posted";
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string;
}

export interface AnalyticsData {
  totalApps: number;
  totalDeals: number;
  totalUsers: number;
  totalSavings: number;
  pageViews: number;
  uniqueVisitors: number;
  downloadRate: number;
  bounceRate: number;
  avgTimeOnPage: string;
  returnVisitors: number;
}

export interface AppPerformance {
  id: string;
  title: string;
  downloads: number;
  rating: number;
  views: number;
  likes: number;
  conversionRate: number;
}

export interface DealPerformance {
  id: string;
  title: string;
  views: number;
  likes: number;
  redemptions: number;
  value: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  savedApps: string[];
  savedDeals: string[];
  claimedDeals: ClaimedDeal[];
  submittedApps: string[];
  submittedDeals: string[];
}
