// === Auth & Business ===
export interface User {
  id: string;
  email: string;
  businessName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

// === Subscription ===
export type SubscriptionTier = 'good' | 'better' | 'best';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  maxListings: number;
  maxPromotions: number;
}

// === Listings ===
export type ListingStatus = 'active' | 'sold' | 'draft' | 'expired';
export type ListingCategory = 'electronics' | 'furniture' | 'vehicles' | 'clothing' | 'home_garden' | 'sports' | 'toys' | 'other';

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  imageUrl: string;
  status: ListingStatus;
  createdAt: string;
  postDate: string;
  location: string;
  promoted: boolean;
  promotionDate?: string;
  promotionDays?: number;
}

// === Ad Campaigns ===
export type CampaignType = 'promoted_listing' | 'display_ad';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended' | 'scheduled';

export type AdPlacement =
  | 'search_results'
  | 'category_page'
  | 'homepage_banner'
  | 'homepage_carousel'
  | 'search_sidebar'
  | 'listing_detail_sidebar';

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  dailyBudget: number;
  totalBudget: number;
  totalSpent: number;
  startDate: string;
  endDate: string;
  targetCategories: ListingCategory[];
  targetLocations: string[];
  placements: AdPlacement[];
  listingIds?: string[];
  creativeIds?: string[];
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

// === Performance Metrics ===
export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  summary: {
    totalImpressions: number;
    totalClicks: number;
    totalSpend: number;
    totalConversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  dailyMetrics: DailyMetric[];
}

// === Ad Creatives ===
export type CreativeType = 'banner' | 'square' | 'leaderboard' | 'skyscraper';

export interface AdCreative {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  dimensions: string;
  type: CreativeType;
  createdAt: string;
}

// === Billing ===
export interface BillingRecord {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  campaignId?: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// === Services ===
export type ServiceCategory = 'cleaning' | 'plumbing' | 'electrical' | 'landscaping' | 'tutoring' | 'pet_care' | 'moving' | 'handyman' | 'auto_repair' | 'other';
export type ServicePricingModel = 'hourly' | 'flat' | 'starting_at' | 'free_estimate';
export type ServiceStatus = 'active' | 'paused' | 'draft';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  serviceCategory: ServiceCategory;
  pricingModel: ServicePricingModel;
  price: number;
  serviceArea: string[];
  availability: string;
  experienceLevel: ExperienceLevel;
  imageUrl: string;
  status: ServiceStatus;
  createdAt: string;
  promoted: boolean;
  promotionDate?: string;
  promotionDays?: number;
}

// === Jobs ===
export type JobType = 'full_time' | 'part_time' | 'contract' | 'gig' | 'internship';
export type JobCategory = 'retail' | 'food_service' | 'warehouse' | 'delivery' | 'healthcare' | 'tech' | 'construction' | 'admin' | 'other';
export type PayType = 'hourly' | 'salary' | 'commission' | 'tips';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  id: string;
  userId: string;
  title: string;
  companyName: string;
  jobType: JobType;
  jobCategory: JobCategory;
  payType: PayType;
  payMin: number;
  payMax: number;
  location: string;
  remote: boolean;
  description: string;
  requirements: string;
  benefits?: string[];
  schedule?: string;
  applicationCount?: number;
  status: JobStatus;
  createdAt: string;
  promoted: boolean;
  promotionDate?: string;
  promotionDays?: number;
}

// === Job Analytics ===
export interface JobDailyMetric {
  date: string;
  views: number;
  clicks: number;
  applications: number;
}

export interface JobAnalytics {
  jobId: string;
  summary: {
    totalViews: number;
    totalClicks: number;
    totalApplications: number;
    ctr: number;
    conversionRate: number;
  };
  dailyMetrics: JobDailyMetric[];
}

// === Rentals ===
export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'room' | 'studio';
export type PetPolicy = 'allowed' | 'not_allowed' | 'case_by_case';
export type LeaseTerm = 'month_to_month' | '6_months' | '1_year' | '2_years';
export type RentalStatus = 'active' | 'rented' | 'draft';

export interface Rental {
  id: string;
  userId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  petPolicy: PetPolicy;
  availableDate: string;
  leaseTerm: LeaseTerm;
  amenities: string[];
  location: string;
  imageUrl: string;
  status: RentalStatus;
  createdAt: string;
  promoted: boolean;
  promotionDate?: string;
  promotionDays?: number;
}
