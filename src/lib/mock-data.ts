import { User, Subscription, Listing, Campaign, DailyMetric, CampaignAnalytics, AdCreative, BillingRecord, PaymentMethod, ListingCategory, Service, ServiceCategory, ServicePricingModel, ExperienceLevel, Job, JobType, JobCategory, PayType, Rental, PropertyType, PetPolicy, LeaseTerm } from './types';

// === User ===
export const mockUser: User = {
  id: 'user-001',
  email: 'raidel@electronicsandmore.com',
  businessName: "Raidel's Electronics & More",
  phone: '(425)-906-3777',
  createdAt: '2026-01-15T00:00:00Z',
};

// === Subscription ===
export const mockSubscription: Subscription = {
  id: 'sub-001',
  userId: 'user-001',
  tier: 'better',
  status: 'active',
  currentPeriodStart: '2026-03-01T00:00:00Z',
  currentPeriodEnd: '2026-03-31T23:59:59Z',
  maxListings: 100,
  maxPromotions: 20,
};

// === Listings ===
const listingData: { title: string; price: number; category: ListingCategory; status: 'active' | 'sold' | 'draft'; promoted: boolean; promotionDays?: number }[] = [
  { title: 'Samsung 65" 4K Smart TV', price: 450, category: 'electronics', status: 'active', promoted: true, promotionDays: 3 },
  { title: 'iPhone 15 Pro Max 256GB', price: 899, category: 'electronics', status: 'active', promoted: true, promotionDays: 1 },
  { title: 'MacBook Pro M3 14"', price: 1599, category: 'electronics', status: 'active', promoted: true, promotionDays: 5 },
  { title: 'Sony WH-1000XM5 Headphones', price: 279, category: 'electronics', status: 'active', promoted: false },
  { title: 'iPad Air M2 64GB', price: 499, category: 'electronics', status: 'active', promoted: false },
  { title: 'Nintendo Switch OLED', price: 299, category: 'electronics', status: 'active', promoted: false },
  { title: 'Mid-Century Modern Sofa', price: 750, category: 'furniture', status: 'active', promoted: true, promotionDays: 2 },
  { title: 'Standing Desk - Adjustable', price: 350, category: 'furniture', status: 'active', promoted: false },
  { title: 'Leather Recliner Chair', price: 425, category: 'furniture', status: 'sold', promoted: false },
  { title: 'Mountain Bike - Trek', price: 650, category: 'sports', status: 'active', promoted: false },
  { title: 'Vintage Record Player', price: 180, category: 'electronics', status: 'active', promoted: false },
  { title: 'Gaming PC RTX 4070', price: 1200, category: 'electronics', status: 'draft', promoted: false },
];

export const mockListings: Listing[] = listingData.map((item, i) => ({
  id: `listing-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  title: item.title,
  description: `High quality ${item.title.toLowerCase()} in great condition.`,
  price: item.price,
  category: item.category,
  imageUrl: `https://picsum.photos/seed/listing${i + 1}/400/300`,
  status: item.status,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 4) + 1)}-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  postDate: `2026-0${Math.min(3, Math.floor(i / 4) + 1)}-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  location: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'][i % 3],
  promoted: item.promoted,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
  promotionDays: item.promotionDays,
}));

// === Daily Metrics Generator ===
function generateDailyMetrics(days: number, baseImpressions: number, baseCPC: number): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  const startDate = new Date('2026-02-16');

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    const trendMultiplier = 1 + (i / days) * 0.3;
    const noise = 0.8 + (((i * 7 + 13) % 20) / 20) * 0.4;

    const impressions = Math.round(baseImpressions * weekendMultiplier * trendMultiplier * noise);
    const ctr = 0.02 + (((i * 3 + 7) % 15) / 15) * 0.03;
    const clicks = Math.round(impressions * ctr);
    const spend = Math.round(clicks * baseCPC * 100) / 100;
    const conversionRate = 0.05 + (((i * 11 + 3) % 10) / 10) * 0.1;
    const conversions = Math.round(clicks * conversionRate);

    metrics.push({
      date: date.toISOString().split('T')[0],
      impressions,
      clicks,
      spend,
      conversions,
    });
  }
  return metrics;
}

// === Campaigns ===
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    userId: 'user-001',
    name: 'Electronics Spring Sale',
    type: 'promoted_listing',
    status: 'active',
    dailyBudget: 25,
    totalBudget: 750,
    totalSpent: 342.50,
    startDate: '2026-02-16T00:00:00Z',
    endDate: '2026-03-31T23:59:59Z',
    targetCategories: ['electronics'],
    targetLocations: ['Seattle, WA', 'Portland, OR'],
    placements: ['search_results', 'category_page'],
    listingIds: ['listing-001', 'listing-002', 'listing-003'],
    impressions: 45200,
    clicks: 1580,
    conversions: 89,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
  {
    id: 'camp-002',
    userId: 'user-001',
    name: 'Furniture Weekend Push',
    type: 'promoted_listing',
    status: 'paused',
    dailyBudget: 15,
    totalBudget: 300,
    totalSpent: 187.25,
    startDate: '2026-02-20T00:00:00Z',
    endDate: '2026-03-20T23:59:59Z',
    targetCategories: ['furniture'],
    targetLocations: ['Seattle, WA'],
    placements: ['search_results'],
    listingIds: ['listing-007'],
    impressions: 18900,
    clicks: 620,
    conversions: 31,
    createdAt: '2026-02-19T00:00:00Z',
    updatedAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'camp-003',
    userId: 'user-001',
    name: 'Brand Awareness - Homepage',
    type: 'display_ad',
    status: 'active',
    dailyBudget: 50,
    totalBudget: 1500,
    totalSpent: 823.00,
    startDate: '2026-02-16T00:00:00Z',
    endDate: '2026-04-15T23:59:59Z',
    targetCategories: ['electronics', 'furniture'],
    targetLocations: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'],
    placements: ['homepage_banner', 'homepage_carousel'],
    creativeIds: ['creative-001', 'creative-002'],
    impressions: 125000,
    clicks: 3750,
    conversions: 156,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
  {
    id: 'camp-004',
    userId: 'user-001',
    name: 'Search Sidebar - Tech Deals',
    type: 'display_ad',
    status: 'ended',
    dailyBudget: 20,
    totalBudget: 400,
    totalSpent: 398.50,
    startDate: '2026-01-15T00:00:00Z',
    endDate: '2026-02-15T23:59:59Z',
    targetCategories: ['electronics'],
    targetLocations: ['Seattle, WA'],
    placements: ['search_sidebar'],
    creativeIds: ['creative-003'],
    impressions: 32000,
    clicks: 960,
    conversions: 48,
    createdAt: '2026-01-14T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
];

// === Campaign Analytics ===
export const mockCampaignAnalytics: Record<string, CampaignAnalytics> = {};
mockCampaigns.forEach((campaign) => {
  const days = campaign.status === 'ended' ? 30 : 30;
  const baseImpressions = campaign.type === 'display_ad' ? 4000 : 1500;
  const baseCPC = campaign.type === 'display_ad' ? 0.22 : 0.18;
  const dailyMetrics = generateDailyMetrics(days, baseImpressions, baseCPC);

  const totalImpressions = dailyMetrics.reduce((sum, d) => sum + d.impressions, 0);
  const totalClicks = dailyMetrics.reduce((sum, d) => sum + d.clicks, 0);
  const totalSpend = dailyMetrics.reduce((sum, d) => sum + d.spend, 0);
  const totalConversions = dailyMetrics.reduce((sum, d) => sum + d.conversions, 0);

  mockCampaignAnalytics[campaign.id] = {
    campaignId: campaign.id,
    summary: {
      totalImpressions,
      totalClicks,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalConversions,
      ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
      cpc: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
      roas: totalSpend > 0 ? Math.round((totalConversions * 50 / totalSpend) * 100) / 100 : 0,
    },
    dailyMetrics,
  };
});

// === Ad Creatives ===
export const mockCreatives: AdCreative[] = [
  { id: 'creative-001', userId: 'user-001', name: 'Spring Sale Banner', imageUrl: 'https://picsum.photos/seed/ad1/728/90', dimensions: '728x90', type: 'leaderboard', createdAt: '2026-02-10T00:00:00Z' },
  { id: 'creative-002', userId: 'user-001', name: 'Electronics Square Ad', imageUrl: 'https://picsum.photos/seed/ad2/300/250', dimensions: '300x250', type: 'square', createdAt: '2026-02-12T00:00:00Z' },
  { id: 'creative-003', userId: 'user-001', name: 'Tech Deals Skyscraper', imageUrl: 'https://picsum.photos/seed/ad3/160/600', dimensions: '160x600', type: 'skyscraper', createdAt: '2026-02-14T00:00:00Z' },
  { id: 'creative-004', userId: 'user-001', name: 'Furniture Collection Banner', imageUrl: 'https://picsum.photos/seed/ad4/468/60', dimensions: '468x60', type: 'banner', createdAt: '2026-03-01T00:00:00Z' },
  { id: 'creative-005', userId: 'user-001', name: 'New Arrivals Square', imageUrl: 'https://picsum.photos/seed/ad5/300/250', dimensions: '300x250', type: 'square', createdAt: '2026-03-05T00:00:00Z' },
  { id: 'creative-006', userId: 'user-001', name: 'Brand Hero Leaderboard', imageUrl: 'https://picsum.photos/seed/ad6/728/90', dimensions: '728x90', type: 'leaderboard', createdAt: '2026-03-10T00:00:00Z' },
];

// === Billing ===
export const mockBillingRecords: BillingRecord[] = [
  { id: 'bill-001', userId: 'user-001', date: '2026-03-01T00:00:00Z', amount: 249, description: 'Enhanced Plan - Monthly Subscription', status: 'paid' },
  { id: 'bill-002', userId: 'user-001', date: '2026-03-01T00:00:00Z', amount: 156.75, description: 'Ad Spend - Electronics Spring Sale', campaignId: 'camp-001', status: 'paid' },
  { id: 'bill-003', userId: 'user-001', date: '2026-03-01T00:00:00Z', amount: 98.50, description: 'Ad Spend - Brand Awareness Homepage', campaignId: 'camp-003', status: 'paid' },
  { id: 'bill-004', userId: 'user-001', date: '2026-02-01T00:00:00Z', amount: 249, description: 'Enhanced Plan - Monthly Subscription', status: 'paid' },
  { id: 'bill-005', userId: 'user-001', date: '2026-02-01T00:00:00Z', amount: 185.75, description: 'Ad Spend - Electronics Spring Sale', campaignId: 'camp-001', status: 'paid' },
  { id: 'bill-006', userId: 'user-001', date: '2026-02-01T00:00:00Z', amount: 187.25, description: 'Ad Spend - Furniture Weekend Push', campaignId: 'camp-002', status: 'paid' },
  { id: 'bill-007', userId: 'user-001', date: '2026-02-01T00:00:00Z', amount: 210.00, description: 'Ad Spend - Brand Awareness Homepage', campaignId: 'camp-003', status: 'paid' },
  { id: 'bill-008', userId: 'user-001', date: '2026-01-01T00:00:00Z', amount: 249, description: 'Enhanced Plan - Monthly Subscription', status: 'paid' },
  { id: 'bill-009', userId: 'user-001', date: '2026-01-01T00:00:00Z', amount: 398.50, description: 'Ad Spend - Search Sidebar Tech Deals', campaignId: 'camp-004', status: 'paid' },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm-001', type: 'visa', last4: '4242', expiry: '12/28', isDefault: true },
  { id: 'pm-002', type: 'mastercard', last4: '8888', expiry: '06/27', isDefault: false },
];

// === Aggregate helpers ===
export function getPromotionsUsed(): number {
  return mockListings.filter(l => l.promoted).length;
}

export function getPromotionsAvailable(): number {
  return mockSubscription.maxPromotions - getPromotionsUsed();
}

export function getTotalAdSpendThisMonth(): number {
  return mockCampaigns
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.totalSpent, 0);
}

export function getTotalImpressions(): number {
  return mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
}

export function getTotalClicks(): number {
  return mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
}

export function getAvgCTR(): number {
  const impressions = getTotalImpressions();
  const clicks = getTotalClicks();
  return impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;
}

// === Services ===
const serviceData: { title: string; description: string; serviceCategory: ServiceCategory; pricingModel: ServicePricingModel; price: number; serviceArea: string[]; availability: string; experienceLevel: ExperienceLevel; status: 'active' | 'paused' | 'draft'; promoted: boolean; promotionDays?: number }[] = [
  { title: 'Deep House Cleaning', description: 'Professional deep cleaning for homes and apartments. We bring all supplies and equipment.', serviceCategory: 'cleaning', pricingModel: 'flat', price: 150, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Mon-Sat 8am-6pm', experienceLevel: 'expert', status: 'active', promoted: true, promotionDays: 3 },
  { title: 'Licensed Plumber - Emergency & Repairs', description: 'Licensed and insured plumber. Same-day emergency service available. All residential plumbing.', serviceCategory: 'plumbing', pricingModel: 'hourly', price: 85, serviceArea: ['Seattle, WA'], availability: '24/7 Emergency Available', experienceLevel: 'expert', status: 'active', promoted: true, promotionDays: 5 },
  { title: 'Math Tutoring K-12', description: 'Experienced math tutor for all grade levels. SAT/ACT prep available. In-person or virtual sessions.', serviceCategory: 'tutoring', pricingModel: 'hourly', price: 45, serviceArea: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'], availability: 'Mon-Fri 3pm-8pm, Weekends 10am-4pm', experienceLevel: 'intermediate', status: 'active', promoted: false },
  { title: 'Dog Walking & Pet Sitting', description: 'Reliable pet care for your furry friends. Daily walks, overnight stays, and drop-in visits.', serviceCategory: 'pet_care', pricingModel: 'starting_at', price: 20, serviceArea: ['Seattle, WA'], availability: 'Daily 7am-9pm', experienceLevel: 'intermediate', status: 'active', promoted: false },
  { title: 'Lawn Care & Landscaping', description: 'Complete lawn maintenance, garden design, and seasonal cleanup. Free estimates for new customers.', serviceCategory: 'landscaping', pricingModel: 'free_estimate', price: 0, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Mon-Sat 7am-5pm', experienceLevel: 'expert', status: 'active', promoted: false },
  { title: 'Local Moving Help', description: 'Two experienced movers with a truck. Apartments, homes, and offices. Loading/unloading available.', serviceCategory: 'moving', pricingModel: 'hourly', price: 120, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Wed-Sun 8am-6pm', experienceLevel: 'intermediate', status: 'active', promoted: false },
  { title: 'Handyman - Odd Jobs & Repairs', description: 'No job too small. Furniture assembly, drywall repair, painting, shelving, and general fixes.', serviceCategory: 'handyman', pricingModel: 'starting_at', price: 50, serviceArea: ['Seattle, WA'], availability: 'Mon-Fri 9am-5pm', experienceLevel: 'beginner', status: 'paused', promoted: false },
  { title: 'Auto Detailing - Mobile Service', description: 'We come to you! Full interior/exterior detail. Ceramic coating and paint correction available.', serviceCategory: 'auto_repair', pricingModel: 'starting_at', price: 99, serviceArea: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'], availability: 'Tue-Sun 8am-6pm', experienceLevel: 'expert', status: 'active', promoted: false },
];

export const mockServices: Service[] = serviceData.map((item, i) => ({
  id: `service-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  title: item.title,
  description: item.description,
  serviceCategory: item.serviceCategory,
  pricingModel: item.pricingModel,
  price: item.price,
  serviceArea: item.serviceArea,
  availability: item.availability,
  experienceLevel: item.experienceLevel,
  imageUrl: `https://picsum.photos/seed/service${i + 1}/400/300`,
  status: item.status,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 3) + 1)}-${String((i * 3 % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  promoted: item.promoted,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
  promotionDays: item.promotionDays,
}));

// === Jobs ===
const jobData: { title: string; companyName: string; jobType: JobType; jobCategory: JobCategory; payType: PayType; payMin: number; payMax: number; location: string; remote: boolean; description: string; requirements: string; status: 'active' | 'closed' | 'draft'; promoted: boolean; promotionDays?: number }[] = [
  { title: 'Barista - Coffee Shop', companyName: "Raidel's Electronics & More", jobType: 'part_time', jobCategory: 'food_service', payType: 'hourly', payMin: 16, payMax: 20, location: 'Seattle, WA', remote: false, description: 'Join our friendly team! Make espresso drinks, serve customers, and keep our cafe welcoming.', requirements: 'Customer service experience preferred. Must be available weekends.', status: 'active', promoted: true, promotionDays: 7 },
  { title: 'Warehouse Associate', companyName: "Raidel's Electronics & More", jobType: 'full_time', jobCategory: 'warehouse', payType: 'hourly', payMin: 18, payMax: 22, location: 'Portland, OR', remote: false, description: 'Pick, pack, and ship electronics orders. Operate warehouse equipment and maintain inventory accuracy.', requirements: 'Able to lift 50 lbs. Forklift certification a plus.', status: 'active', promoted: true, promotionDays: 5 },
  { title: 'Frontend Developer', companyName: "Raidel's Electronics & More", jobType: 'full_time', jobCategory: 'tech', payType: 'salary', payMin: 85000, payMax: 120000, location: 'Seattle, WA', remote: true, description: 'Build and maintain our e-commerce platform. Work with React, TypeScript, and Next.js.', requirements: '3+ years frontend experience. React and TypeScript required.', status: 'active', promoted: false },
  { title: 'Delivery Driver', companyName: "Raidel's Electronics & More", jobType: 'gig', jobCategory: 'delivery', payType: 'hourly', payMin: 20, payMax: 30, location: 'Seattle, WA', remote: false, description: 'Deliver electronics to local customers. Use company van or your own vehicle.', requirements: 'Valid driver license. Clean driving record. Smartphone required.', status: 'active', promoted: false },
  { title: 'Retail Sales Associate', companyName: "Raidel's Electronics & More", jobType: 'part_time', jobCategory: 'retail', payType: 'hourly', payMin: 17, payMax: 21, location: 'San Francisco, CA', remote: false, description: 'Help customers find the right electronics. Provide product knowledge and process transactions.', requirements: 'Electronics knowledge helpful. Retail experience preferred.', status: 'active', promoted: false },
  { title: 'Office Administrator', companyName: "Raidel's Electronics & More", jobType: 'full_time', jobCategory: 'admin', payType: 'salary', payMin: 45000, payMax: 55000, location: 'Seattle, WA', remote: false, description: 'Manage office operations, coordinate schedules, handle vendor communications.', requirements: 'Proficient in Google Workspace. 2+ years admin experience.', status: 'active', promoted: false },
  { title: 'Summer Intern - Marketing', companyName: "Raidel's Electronics & More", jobType: 'internship', jobCategory: 'admin', payType: 'hourly', payMin: 18, payMax: 22, location: 'Seattle, WA', remote: true, description: 'Assist with social media, email campaigns, and marketplace optimization.', requirements: 'Currently enrolled in college. Marketing or business major preferred.', status: 'draft', promoted: false },
  { title: 'Electronics Repair Technician', companyName: "Raidel's Electronics & More", jobType: 'contract', jobCategory: 'tech', payType: 'hourly', payMin: 25, payMax: 40, location: 'Portland, OR', remote: false, description: 'Diagnose and repair consumer electronics. Phones, laptops, gaming consoles.', requirements: 'Experience with micro-soldering. CompTIA A+ preferred.', status: 'closed', promoted: false },
];

export const mockJobs: Job[] = jobData.map((item, i) => ({
  id: `job-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  ...item,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 3) + 1)}-${String((i * 4 % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
}));

// === Rentals ===
const rentalData: { title: string; description: string; propertyType: PropertyType; rent: number; bedrooms: number; bathrooms: number; sqft: number; petPolicy: PetPolicy; availableDate: string; leaseTerm: LeaseTerm; amenities: string[]; location: string; status: 'active' | 'rented' | 'draft'; promoted: boolean; promotionDays?: number }[] = [
  { title: 'Spacious 2BR Capitol Hill Apt', description: 'Bright, updated 2-bedroom apartment in the heart of Capitol Hill. Walking distance to shops and restaurants.', propertyType: 'apartment', rent: 2200, bedrooms: 2, bathrooms: 1, sqft: 950, petPolicy: 'allowed', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['In-Unit Laundry', 'Dishwasher', 'AC', 'Balcony'], location: 'Seattle, WA', status: 'active', promoted: true, promotionDays: 7 },
  { title: 'Cozy Studio Downtown', description: 'Modern studio with floor-to-ceiling windows, city views, and building amenities.', propertyType: 'studio', rent: 1450, bedrooms: 0, bathrooms: 1, sqft: 480, petPolicy: 'not_allowed', availableDate: '2026-04-15', leaseTerm: '1_year', amenities: ['Gym', 'Parking', 'AC', 'Storage'], location: 'Seattle, WA', status: 'active', promoted: true, promotionDays: 5 },
  { title: '3BR House with Yard - Ballard', description: 'Charming 3-bedroom house with fenced yard and detached garage. Quiet residential neighborhood.', propertyType: 'house', rent: 3200, bedrooms: 3, bathrooms: 2, sqft: 1600, petPolicy: 'allowed', availableDate: '2026-05-01', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'Storage'], location: 'Seattle, WA', status: 'active', promoted: false },
  { title: 'Modern 1BR Condo - Pearl District', description: 'Sleek one-bedroom condo with stainless steel appliances and in-unit washer/dryer.', propertyType: 'condo', rent: 1800, bedrooms: 1, bathrooms: 1, sqft: 720, petPolicy: 'case_by_case', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['In-Unit Laundry', 'Dishwasher', 'AC', 'Gym', 'Pool'], location: 'Portland, OR', status: 'active', promoted: false },
  { title: 'Furnished Room in Shared House', description: 'Private furnished room in a friendly shared house. Shared kitchen, living room, and bathroom.', propertyType: 'room', rent: 750, bedrooms: 1, bathrooms: 1, sqft: 200, petPolicy: 'not_allowed', availableDate: '2026-03-25', leaseTerm: 'month_to_month', amenities: ['Shared Laundry', 'Parking'], location: 'Portland, OR', status: 'active', promoted: false },
  { title: '2BR Townhouse - Inner Sunset', description: 'Two-story townhouse with private patio. Close to Golden Gate Park and N-Judah line.', propertyType: 'townhouse', rent: 3500, bedrooms: 2, bathrooms: 1.5, sqft: 1100, petPolicy: 'allowed', availableDate: '2026-05-15', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'Balcony', 'Storage'], location: 'San Francisco, CA', status: 'active', promoted: false },
  { title: 'Budget 1BR Near University', description: 'Affordable one-bedroom near campus. Great for students or young professionals.', propertyType: 'apartment', rent: 1100, bedrooms: 1, bathrooms: 1, sqft: 550, petPolicy: 'not_allowed', availableDate: '2026-06-01', leaseTerm: '6_months', amenities: ['Shared Laundry', 'AC'], location: 'Portland, OR', status: 'draft', promoted: false },
  { title: 'Luxury 2BR Waterfront Condo', description: 'Premium waterfront living with panoramic lake views. Concierge service and rooftop deck.', propertyType: 'condo', rent: 4200, bedrooms: 2, bathrooms: 2, sqft: 1300, petPolicy: 'case_by_case', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'AC', 'Gym', 'Pool', 'Balcony', 'EV Charging'], location: 'Seattle, WA', status: 'rented', promoted: false },
];

export const mockRentals: Rental[] = rentalData.map((item, i) => ({
  id: `rental-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  ...item,
  imageUrl: `https://picsum.photos/seed/rental${i + 1}/400/300`,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 3) + 1)}-${String((i * 3 % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
}));
