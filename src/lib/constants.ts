import { AdPlacement, ListingCategory, SubscriptionTier } from './types';

export const TIER_CONFIG: Record<SubscriptionTier, {
  name: string;
  displayName: string;
  price: number;
  priceLabel: string;
  maxListings: number;
  maxPromotions: number;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}> = {
  good: {
    name: 'Starter',
    displayName: 'Good',
    price: 49,
    priceLabel: '$49/mo',
    maxListings: 35,
    maxPromotions: 4,
    features: [
      '35 active listings',
      '4 promoted listings/mo',
      'Business profile page',
      'Basic analytics',
      'Email support',
    ],
    ctaLabel: 'Get Started',
  },
  better: {
    name: 'Enhanced',
    displayName: 'Better',
    price: 249,
    priceLabel: '$249/mo',
    maxListings: 100,
    maxPromotions: 20,
    features: [
      '100 active listings',
      '20 promoted listings/mo',
      'Display ad campaigns',
      'Full analytics dashboard',
      'Business profile page',
      'Search all inventory',
      'Click2Call',
      'Images in Chat',
      'Quick Replies',
      'Shopify integration',
      'Priority support',
    ],
    highlighted: true,
    ctaLabel: 'Get Started',
  },
  best: {
    name: 'Elite',
    displayName: 'Best',
    price: 0,
    priceLabel: 'Custom',
    maxListings: 999,
    maxPromotions: 999,
    features: [
      'Unlimited listings',
      'Unlimited promotions',
      'All display ad placements',
      'Verified Business Badge',
      'Dedicated account manager',
      'Listing refreshes',
      'Custom reporting',
      'All Enhanced features',
    ],
    ctaLabel: 'Contact Sales',
  },
};

export const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home_garden', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'other', label: 'Other' },
];

export const LOCATIONS = [
  'Seattle, WA',
  'Portland, OR',
  'San Francisco, CA',
  'Los Angeles, CA',
  'Phoenix, AZ',
  'Denver, CO',
  'Dallas, TX',
  'Houston, TX',
  'Miami, FL',
  'Atlanta, GA',
  'Chicago, IL',
  'New York, NY',
];

export const AD_PLACEMENTS: { value: AdPlacement; label: string; description: string; estimatedReach: string }[] = [
  { value: 'search_results', label: 'Search Results', description: 'Appear at the top of search results', estimatedReach: '~50K daily views' },
  { value: 'category_page', label: 'Category Page', description: 'Featured on category browse pages', estimatedReach: '~30K daily views' },
  { value: 'homepage_banner', label: 'Homepage Banner', description: 'Large banner on the OfferUp homepage', estimatedReach: '~100K daily views' },
  { value: 'homepage_carousel', label: 'Homepage Carousel', description: 'Featured in the homepage carousel', estimatedReach: '~80K daily views' },
  { value: 'search_sidebar', label: 'Search Sidebar', description: 'Sidebar placement on search results', estimatedReach: '~40K daily views' },
  { value: 'listing_detail_sidebar', label: 'Listing Detail', description: 'Sidebar on individual listing pages', estimatedReach: '~25K daily views' },
];

export const CREATIVE_DIMENSIONS: { type: string; label: string; dimensions: string; width: number; height: number }[] = [
  { type: 'leaderboard', label: 'Leaderboard', dimensions: '728x90', width: 728, height: 90 },
  { type: 'banner', label: 'Banner', dimensions: '468x60', width: 468, height: 60 },
  { type: 'square', label: 'Square', dimensions: '300x250', width: 300, height: 250 },
  { type: 'skyscraper', label: 'Skyscraper', dimensions: '160x600', width: 160, height: 600 },
];

// === Services ===
import type { ServiceCategory, ServicePricingModel, ExperienceLevel, JobType, JobCategory, PayType, PropertyType, PetPolicy, LeaseTerm } from './types';

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'pet_care', label: 'Pet Care' },
  { value: 'moving', label: 'Moving' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'auto_repair', label: 'Auto Repair' },
  { value: 'other', label: 'Other' },
];

export const SERVICE_PRICING_MODELS: { value: ServicePricingModel; label: string }[] = [
  { value: 'hourly', label: 'Per Hour' },
  { value: 'flat', label: 'Flat Rate' },
  { value: 'starting_at', label: 'Starting At' },
  { value: 'free_estimate', label: 'Free Estimate' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

// === Jobs ===
export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'gig', label: 'Gig' },
  { value: 'internship', label: 'Internship' },
];

export const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'retail', label: 'Retail' },
  { value: 'food_service', label: 'Food Service' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'tech', label: 'Tech' },
  { value: 'construction', label: 'Construction' },
  { value: 'admin', label: 'Admin' },
  { value: 'other', label: 'Other' },
];

export const PAY_TYPES: { value: PayType; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'salary', label: 'Salary' },
  { value: 'commission', label: 'Commission' },
  { value: 'tips', label: 'Tips' },
];

// === Rentals ===
export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'room', label: 'Room' },
  { value: 'studio', label: 'Studio' },
];

export const PET_POLICIES: { value: PetPolicy; label: string }[] = [
  { value: 'allowed', label: 'Pets Allowed' },
  { value: 'not_allowed', label: 'No Pets' },
  { value: 'case_by_case', label: 'Case by Case' },
];

export const LEASE_TERMS: { value: LeaseTerm; label: string }[] = [
  { value: 'month_to_month', label: 'Month to Month' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
  { value: '2_years', label: '2 Years' },
];

export const AMENITIES = [
  'Parking', 'In-Unit Laundry', 'Shared Laundry', 'Dishwasher', 'AC',
  'Gym', 'Pool', 'Balcony', 'Storage', 'EV Charging',
];

export const OFFERUP_GREEN = '#00AB80';
export const OFFERUP_DARK_GREEN = '#008F6B';
export const OFFERUP_LIGHT_GREEN = '#E6F7F2';
