/**
 * Marketplace data (categories, user, submissions, analytics) – reference features.
 * Apps/deals list stays in mock-data.ts for backward compatibility.
 */

import type {
  Category,
  Submission,
  CurrentUser,
  Notification,
  ActivityLog,
  AnalyticsData,
  AppPerformance,
  DealPerformance,
} from "@/types/marketplace";

export const categories: Category[] = [
  { id: "all", name: "All Categories", icon: "LayoutGrid", count: 156 },
  { id: "crm", name: "CRM & Sales", icon: "Users", count: 23 },
  { id: "analytics", name: "Analytics & BI", icon: "BarChart3", count: 18 },
  { id: "marketing", name: "Marketing", icon: "TrendingUp", count: 31 },
  { id: "finance", name: "Finance", icon: "DollarSign", count: 15 },
  { id: "productivity", name: "Productivity", icon: "Target", count: 22 },
  { id: "development", name: "Development", icon: "Code", count: 28 },
  { id: "ai", name: "AI & ML", icon: "Brain", count: 25 },
  { id: "ecommerce", name: "E-commerce", icon: "ShoppingCart", count: 7 },
];

export const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    type: "app",
    title: "Project Management Pro",
    company: "TaskFlow Inc",
    description: "Advanced project management with AI task prioritization",
    status: "pending",
    priority: "high",
    submittedAt: "2024-01-16T10:30:00Z",
    submittedBy: "John Smith",
    submitterEmail: "john@taskflow.com",
    reviewNotes: "",
    data: {
      title: "Project Management Pro",
      company: "TaskFlow Inc",
      description: "Advanced project management with AI task prioritization",
      website: "https://taskflow.io",
      contactEmail: "john@taskflow.com",
      contactPhone: "",
      type: "trial",
      category: "productivity",
      trialPeriod: "14 days",
      pricing: "$39/month",
      targetAudience: "SMB",
      keyFeatures: "AI prioritization, Team collaboration",
      termsAccepted: true,
      privacyAccepted: true,
    },
  },
  {
    id: "sub-2",
    type: "deal",
    title: "Design Tool Starter Pack",
    company: "DesignHub",
    description: "3 months free premium access",
    status: "needs_revision",
    priority: "normal",
    submittedAt: "2024-01-15T14:20:00Z",
    submittedBy: "Sarah Johnson",
    submitterEmail: "sarah@designhub.com",
    reviewNotes: "Please provide eligibility criteria.",
    data: {
      title: "Design Tool Starter Pack",
      company: "DesignHub",
      description: "3 months free premium access",
      website: "https://designhub.com",
      contactEmail: "sarah@designhub.com",
      contactPhone: "",
      type: "discount",
      value: "600",
      discount: "100",
      deadline: "2026-06-30",
      location: "Global",
      category: "productivity",
      requirements: "New customers only",
      benefits: "3 months free premium",
      couponCode: "DHSTARTER",
      terms: "",
      termsAccepted: true,
      privacyAccepted: true,
    },
  },
];

export const mockCurrentUser: CurrentUser = {
  id: "user-1",
  email: "founder@startup.io",
  name: "Alex Founder",
  savedApps: ["app-1", "app-2"],
  savedDeals: ["deal-1"],
  claimedDeals: [
    { dealId: "deal-1", claimedAt: "2025-02-10T12:00:00Z", status: "active", couponCode: "GROWTH50" },
  ],
  submittedApps: [],
  submittedDeals: [],
};

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "submission_update",
    title: "Submission received",
    message: "Your app submission is under review.",
    read: false,
    createdAt: "2025-02-18T09:00:00Z",
    link: "/dashboard",
  },
  {
    id: "n2",
    type: "deal_expiring",
    title: "Deal expiring soon",
    message: "50% off GrowthMetrics expires in 7 days.",
    read: true,
    createdAt: "2025-02-15T10:00:00Z",
    link: "/deal/deal-1",
  },
];

export const mockActivityLog: ActivityLog[] = [
  {
    id: "a1",
    type: "deal_claimed",
    title: "Deal claimed",
    description: "You claimed 50% off first year",
    timestamp: "2025-02-10T12:00:00Z",
    relatedId: "deal-1",
  },
  {
    id: "a2",
    type: "app_submitted",
    title: "App submitted",
    description: "Project Management Pro submitted for review",
    timestamp: "2025-02-08T14:00:00Z",
  },
];

export const mockAnalyticsData: AnalyticsData = {
  totalApps: 156,
  totalDeals: 89,
  totalUsers: 2500,
  totalSavings: 2500000,
  pageViews: 125000,
  uniqueVisitors: 42000,
  downloadRate: 12.5,
  bounceRate: 38,
  avgTimeOnPage: "3m 24s",
  returnVisitors: 62,
};

export const mockAppPerformance: AppPerformance[] = [
  { id: "app-1", title: "GrowthMetrics", downloads: 1240, rating: 4.8, views: 2891, likes: 156, conversionRate: 8.2 },
  { id: "app-2", title: "LaunchPad CRM", downloads: 890, rating: 4.6, views: 2156, likes: 134, conversionRate: 6.1 },
  { id: "app-3", title: "DealFlow", downloads: 2100, rating: 4.9, views: 4567, likes: 312, conversionRate: 9.4 },
];

export const mockDealPerformance: DealPerformance[] = [
  { id: "deal-1", title: "50% off first year", views: 1247, likes: 156, redemptions: 342, value: 50000 },
  { id: "deal-2", title: "Free trial 30 days", views: 987, likes: 134, redemptions: 156, value: 2500 },
];

/** Predefined collections (reference: filter apps/deals by criteria) */
export const collectionDefinitions = [
  { id: "editors-choice", name: "Editor's Choice", description: "Hand-picked by our team" },
  { id: "trending-now", name: "Trending Now", description: "Most popular this week" },
  { id: "new-noteworthy", name: "New & Noteworthy", description: "Recently added" },
  { id: "best-free", name: "Best Free", description: "Free trials and free forever" },
  { id: "startup-essentials", name: "Startup Essentials", description: "Must-haves for founders" },
];
