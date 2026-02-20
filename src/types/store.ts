export type AppOrDeal = "app" | "deal";

/** App program type: trial, beta, pilot, validation, free, demo, enterprise */
export type AppProgramType =
  | "trial"
  | "beta"
  | "pilot"
  | "validation"
  | "free"
  | "demo"
  | "enterprise";

/** Launch/recruitment info for beta, pilot, validation programs */
export interface AppLaunchInfo {
  /** Pilot: total slots */
  pilotSlots?: number;
  /** Pilot: filled slots */
  pilotSlotsFilled?: number;
  /** Beta: current testers */
  betaUsers?: number;
  /** Beta: max testers wanted */
  maxBetaUsers?: number;
  /** Validation: goal description */
  validationGoal?: string;
  /** Validation: progress % */
  progress?: number;
  /** Validation: goals list */
  goals?: string[];
}

export interface Publisher {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  /** About the startup / company */
  about?: string;
  website?: string;
}

/** Single user review with star rating and comment */
export interface AppReview {
  id: string;
  userName: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  helpful?: number;
  verified?: boolean;
}

/** What's new / changelog entry */
export interface AppWhatsNew {
  version: string;
  date: string;
  notes: string[];
}

/** How users can get the app. Developer picks which to feature (store, web, Huawei, direct, etc.). */
export type AppDistributionType =
  | "app-store"
  | "play-store"
  | "web"
  | "huawei"
  | "direct"
  | "other";

export interface AppDistributionOption {
  type: AppDistributionType;
  url: string;
  /** Custom label; defaults per type (e.g. "App Store", "Web app", "Huawei AppGallery") */
  label?: string;
}

/** Listing status: only approved items are shown in the store. */
export type ListingStatus = "pending" | "approved" | "rejected";

export interface App {
  id: string;
  type: "app";
  name: string;
  /** If omitted, treated as approved for backward compatibility. */
  status?: ListingStatus;
  description: string;
  /** Full description (supports multiple paragraphs). Shown in Description section. */
  longDescription?: string;
  imageUrl: string;
  /** Screenshot / preview image URLs for the app. Shown in preview section. */
  screenshots?: string[];
  /** Video URLs (YouTube, Vimeo, or direct .mp4/.webm) for app preview / advertisement. */
  videos?: string[];
  publisher: Publisher;
  usersCount: number;
  dealsCount: number;
  category: string;
  badges: ("New" | "Featured")[];
  createdAt: string;
  /** Program type (trial, beta, pilot, validation, etc.) */
  appType?: AppProgramType;
  /** Seeking beta testers */
  seekingBetaTesters?: boolean;
  /** Seeking pilot users / pilot program open */
  seekingPilotUsers?: boolean;
  /** Seeking validation participants */
  seekingValidationUsers?: boolean;
  /** Slot/progress info for beta, pilot, validation */
  launchInfo?: AppLaunchInfo;
  /** Trial period label (e.g. "30 days", "Free during beta") */
  trialPeriod?: string;
  /** Pricing label */
  pricing?: string;
  /** Star rating 0–5 (average) */
  rating?: number;
  /** Total number of ratings/reviews */
  ratingCount?: number;
  /** User reviews with star and comment */
  reviews?: AppReview[];
  /** Key features (for detail page) */
  features?: string[];
  /** Download count (or installs) */
  downloads?: number;
  /** What's new / changelog */
  whatsNew?: AppWhatsNew[];
  /** Current version string */
  version?: string;
  /** Last updated date (ISO or YYYY-MM-DD) */
  lastUpdated?: string;
  /** App size e.g. "45 MB" */
  size?: string;
  /** Supported languages */
  languages?: string[];
  /** Age rating e.g. "4+", "12+", "17+" */
  ageRating?: string;
  /** Has in-app purchases */
  inAppPurchase?: boolean;
  /** Copyright notice */
  copyright?: string;
  /** Developer/publisher website */
  website?: string;
  /** Where users can get the app. Developer chooses: App Store, Play Store, web app, Huawei AppGallery, direct download, etc. */
  distributionOptions?: AppDistributionOption[];
  /** iOS App Store URL (legacy; use distributionOptions when possible) */
  appStoreUrl?: string;
  /** Android Google Play Store URL (legacy) */
  playStoreUrl?: string;
  /** Direct download URL (legacy) */
  directDownloadUrl?: string;
  /** Label for direct download (legacy) */
  directDownloadLabel?: string;
  /** Privacy policy URL */
  privacyPolicyUrl?: string;
  /** Platforms e.g. Web, iOS, Android */
  platforms?: string[];
  /** When set, this app is also listed on the ecosystem crowdfunding platform; show funding + reward tiers */
  crowdfunding?: {
    campaignId: string;
    goalAmount: number;
    raised: number;
    backers: number;
    daysLeft: number;
    tiers: { name: string; price: string; desc: string }[];
  };
}

/** Deal offer type: what the company is offering */
export type DealType =
  | "discount"
  | "free_trial"
  | "credits"
  | "free_download"
  | "bundle"
  | "partnership"
  | "free";

export interface Deal {
  id: string;
  type: "deal";
  title: string;
  /** If omitted, treated as approved for backward compatibility. */
  status?: ListingStatus;
  description: string;
  imageUrl: string;
  appId: string;
  appName: string;
  publisher: Publisher;
  /** Human-readable offer label (e.g. "50% off", "3 months free", "$50 credits"). Shown as primary value. */
  discount: string;
  /** Kind of offer for badges and filtering. Defaults to "discount" if omitted. */
  dealType?: DealType;
  category: string;
  badges: ("Deal" | "Limited time")[];
  createdAt: string;
  couponCode?: string;
  /** Optional expiry or "Limited time" hint */
  deadline?: string;
}

export type Listing = App | Deal;
