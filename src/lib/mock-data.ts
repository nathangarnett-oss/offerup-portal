import { User, Subscription, Listing, Campaign, DailyMetric, CampaignAnalytics, AdCreative, BillingRecord, PaymentMethod, ListingCategory, Service, ServiceCategory, ServicePricingModel, ExperienceLevel, Job, JobType, JobCategory, PayType, JobDailyMetric, JobAnalytics, ServiceDailyMetric, ServiceAnalytics, Rental, RentalDailyMetric, RentalAnalytics, PropertyType, PetPolicy, LeaseTerm } from './types';

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
const serviceData: { title: string; description: string; serviceCategory: ServiceCategory; pricingModel: ServicePricingModel; price: number; serviceArea: string[]; availability: string; experienceLevel: ExperienceLevel; status: 'active' | 'paused' | 'draft'; promoted: boolean; promotionDays?: number; inquiryCount: number }[] = [
  {
    title: 'Deep House Cleaning',
    description: 'Professional deep cleaning for homes and apartments. We bring all supplies and equipment — eco-friendly products available on request.\n\nWhat\'s included:\n- Kitchen deep clean (appliances, cabinets, countertops)\n- Bathroom sanitization and scrub\n- All floors vacuumed and mopped\n- Dusting all surfaces, baseboards, and ceiling fans\n- Window sill and interior glass cleaning\n- Trash removal and fresh linen setup\n\nWe serve single-family homes, apartments, and condos up to 3,000 sqft. Larger properties quoted separately.',
    serviceCategory: 'cleaning', pricingModel: 'flat', price: 150, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Mon-Sat 8am-6pm', experienceLevel: 'expert', status: 'active', promoted: true, promotionDays: 3, inquiryCount: 47,
  },
  {
    title: 'Licensed Plumber - Emergency & Repairs',
    description: 'Licensed and insured plumber with 15+ years of experience. Same-day emergency service available for urgent issues.\n\nServices we offer:\n- Leak detection and repair\n- Drain cleaning and unclogging\n- Water heater installation and repair\n- Faucet, toilet, and fixture replacement\n- Pipe repair and repiping\n- Garbage disposal installation\n- Sump pump service\n\nAll work is guaranteed. We provide free estimates for non-emergency jobs and transparent pricing before any work begins.',
    serviceCategory: 'plumbing', pricingModel: 'hourly', price: 85, serviceArea: ['Seattle, WA'], availability: '24/7 Emergency Available', experienceLevel: 'expert', status: 'active', promoted: true, promotionDays: 5, inquiryCount: 32,
  },
  {
    title: 'Math Tutoring K-12',
    description: 'Experienced math tutor helping students build confidence and improve grades. I specialize in making math click for students who feel stuck.\n\nSubjects covered:\n- Elementary math fundamentals\n- Pre-Algebra and Algebra I/II\n- Geometry and Trigonometry\n- Pre-Calculus and AP Calculus\n- SAT/ACT math prep\n- Common Core aligned curriculum\n\nSessions are 60 minutes and can be in-person or virtual (Zoom). I bring worksheets and practice materials. Progress reports provided monthly to parents.',
    serviceCategory: 'tutoring', pricingModel: 'hourly', price: 45, serviceArea: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'], availability: 'Mon-Fri 3pm-8pm, Weekends 10am-4pm', experienceLevel: 'intermediate', status: 'active', promoted: false, inquiryCount: 19,
  },
  {
    title: 'Dog Walking & Pet Sitting',
    description: 'Reliable, loving care for your furry family members! Whether you need daily walks or overnight pet sitting, I treat every pet like my own.\n\nServices offered:\n- 30-minute or 60-minute dog walks\n- Drop-in visits (feeding, medication, playtime)\n- Overnight pet sitting in your home\n- Puppy visits (extra energy burn!)\n- Cat care and small animal care\n\nAll walks include a GPS-tracked route and photo updates. First walk is 50% off so your pet can get comfortable with me! Fully insured through PetSitter.com.',
    serviceCategory: 'pet_care', pricingModel: 'starting_at', price: 20, serviceArea: ['Seattle, WA'], availability: 'Daily 7am-9pm', experienceLevel: 'intermediate', status: 'active', promoted: false, inquiryCount: 28,
  },
  {
    title: 'Lawn Care & Landscaping',
    description: 'Complete lawn maintenance and landscaping services to keep your outdoor space looking its best all year round.\n\nServices include:\n- Weekly/bi-weekly lawn mowing and edging\n- Garden bed design and planting\n- Hedge and shrub trimming\n- Seasonal cleanup (spring and fall)\n- Mulching and soil amendment\n- Irrigation system maintenance\n- Pressure washing (driveways, patios)\n\nFree estimates for all new customers. We serve residential and small commercial properties. Licensed and insured with 10+ years of experience.',
    serviceCategory: 'landscaping', pricingModel: 'free_estimate', price: 0, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Mon-Sat 7am-5pm', experienceLevel: 'expert', status: 'active', promoted: false, inquiryCount: 15,
  },
  {
    title: 'Local Moving Help',
    description: 'Two experienced movers with a 16-foot box truck ready to help with your next move. We handle apartments, houses, and offices in the greater Seattle/Portland metro area.\n\nWhat we provide:\n- Professional loading and unloading\n- Furniture disassembly and reassembly\n- Blanket wrapping for fragile items\n- Dolly and hand truck equipment\n- Clean, smoke-free truck\n\nMinimum 2-hour booking. We can also help with single-item moves (couches, appliances, etc). No hidden fees — the rate you see is the rate you pay.',
    serviceCategory: 'moving', pricingModel: 'hourly', price: 120, serviceArea: ['Seattle, WA', 'Portland, OR'], availability: 'Wed-Sun 8am-6pm', experienceLevel: 'intermediate', status: 'active', promoted: false, inquiryCount: 22,
  },
  {
    title: 'Handyman - Odd Jobs & Repairs',
    description: 'No job too small! I handle a wide range of home repairs and odd jobs so you don\'t have to.\n\nCommon jobs I do:\n- Furniture assembly (IKEA, Wayfair, etc.)\n- Drywall patching and repair\n- Interior painting and touch-ups\n- Shelf and TV mounting\n- Door and lock installation\n- Minor plumbing (faucets, toilets)\n- General fixes and maintenance\n\nHourly rate with a 1-hour minimum. I bring my own tools. Happy to provide references from repeat customers.',
    serviceCategory: 'handyman', pricingModel: 'starting_at', price: 50, serviceArea: ['Seattle, WA'], availability: 'Mon-Fri 9am-5pm', experienceLevel: 'beginner', status: 'paused', promoted: false, inquiryCount: 8,
  },
  {
    title: 'Auto Detailing - Mobile Service',
    description: 'We come to your home or office! Premium mobile auto detailing that makes your car look showroom-new.\n\nPackages available:\n- Express Wash & Vacuum ($99)\n- Full Interior + Exterior Detail ($199)\n- Premium Detail with Clay Bar & Polish ($299)\n- Ceramic Coating Application ($499+)\n- Paint Correction (quote based on condition)\n\nWe use professional-grade products and equipment. Each detail includes a multi-point inspection and before/after photos. Satisfaction guaranteed or we\'ll redo it free.',
    serviceCategory: 'auto_repair', pricingModel: 'starting_at', price: 99, serviceArea: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'], availability: 'Tue-Sun 8am-6pm', experienceLevel: 'expert', status: 'active', promoted: false, inquiryCount: 36,
  },
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
  inquiryCount: item.inquiryCount,
}));

// === Service Analytics ===
function generateServiceDailyMetrics(days: number, baseViews: number, promoted: boolean): ServiceDailyMetric[] {
  const metrics: ServiceDailyMetric[] = [];
  const startDate = new Date('2026-02-24');
  const promotionMultiplier = promoted ? 1.6 : 1;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
    const trendMultiplier = 1 + (i / days) * 0.15;
    const noise = 0.75 + (((i * 7 + 13) % 20) / 20) * 0.5;

    const views = Math.round(baseViews * weekendMultiplier * trendMultiplier * noise * promotionMultiplier);
    const clickRate = 0.12 + (((i * 3 + 7) % 15) / 15) * 0.12;
    const clicks = Math.round(views * clickRate);
    const inquiryRate = 0.04 + (((i * 11 + 3) % 10) / 10) * 0.06;
    const inquiries = Math.round(clicks * inquiryRate);

    metrics.push({ date: date.toISOString().split('T')[0], views, clicks, inquiries });
  }
  return metrics;
}

export const mockServiceAnalytics: Record<string, ServiceAnalytics> = {};
mockServices.forEach((service) => {
  const days = 30;
  const baseViews = service.status === 'paused' ? 40 : service.pricingModel === 'free_estimate' ? 100 : 150;
  const dailyMetrics = generateServiceDailyMetrics(days, baseViews, service.promoted);

  const totalViews = dailyMetrics.reduce((sum, d) => sum + d.views, 0);
  const totalClicks = dailyMetrics.reduce((sum, d) => sum + d.clicks, 0);
  const totalInquiries = dailyMetrics.reduce((sum, d) => sum + d.inquiries, 0);

  mockServiceAnalytics[service.id] = {
    serviceId: service.id,
    summary: {
      totalViews,
      totalClicks,
      totalInquiries,
      ctr: totalViews > 0 ? Math.round((totalClicks / totalViews) * 10000) / 100 : 0,
      conversionRate: totalClicks > 0 ? Math.round((totalInquiries / totalClicks) * 10000) / 100 : 0,
    },
    dailyMetrics,
  };
});

// === Jobs ===
const jobData: { title: string; companyName: string; jobType: JobType; jobCategory: JobCategory; payType: PayType; payMin: number; payMax: number; location: string; remote: boolean; description: string; requirements: string; benefits: string[]; schedule: string; applicationCount: number; status: 'active' | 'closed' | 'draft'; promoted: boolean; promotionDays?: number }[] = [
  {
    title: 'VP of Product, Marketplace',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'tech',
    payType: 'salary',
    payMin: 250000,
    payMax: 350000,
    location: 'Bellevue, WA',
    remote: false,
    description: 'As VP of Marketplace, you will be part of the company\'s executive team and own the nucleus of the entire OfferUp local platform experience. OfferUp Product Management Leaders work with cross-functional teams of engineers, designers, data scientists, and researchers to build products.\n\nYou are a strategic collaborator who serves as a business partner to OfferUp leadership — a smart, data-driven decision-maker who takes professional pride in operational excellence while meeting and exceeding stretch goals.\n\nResponsibilities:\n- Define critical pieces of the Discovery journey for millions of buyers each day, including which items are surfaced from the extensive catalog and how they are presented to the buyer\n- Understand OfferUp\'s strategic and competitive position and deliver products that are recognized best in the industry\n- Be a change agent to maximize efficiency; define and analyze metrics that inform the success of products\n- Adapt and modify product and business requirements based on quantitative and qualitative results\n- Act as a champion for OfferUp\'s mission, vision, and values, and partner across the Company to drive a high-performance work environment',
    requirements: 'Proven track record of setting a vision and strategy combined with driving solutions and practices that are both innovative and scrappy. 10+ years of Product Management and P&L Management experience building and delivering B2C products within a high-performance tech company serving millions of customers. Excellent written and verbal communication skills. Experience working with both large companies with established best-in-class Product and Engineering practices and operating effectively at an early-stage technology company. Experience with Discovery, Search, and/or Personalization.',
    benefits: ['Competitive salary + equity package', 'Executive leadership role', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Relocation assistance available'],
    schedule: 'Full-time. On-site at Bellevue, WA headquarters.',
    applicationCount: 89,
    status: 'active',
    promoted: true,
    promotionDays: 14,
  },
  {
    title: 'Principal Product Manager – Merchant Platforms',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'tech',
    payType: 'salary',
    payMin: 180000,
    payMax: 240000,
    location: 'Miami, FL',
    remote: false,
    description: 'We\'re looking for a Senior/Principal Product Manager who is passionate about building tools and online platforms to help merchants succeed on OfferUp.\n\nResponsibilities:\n- Evaluate and prioritize every feature request for the merchant platforms\n- Gather detailed business requirements from business owners and translate them into user narratives that can be implemented by tech teams\n- Drive the development of tools and features that help merchants become successful on OfferUp\n- Own the product roadmap for merchant-facing tools including listing management, analytics, and promotional features\n- Partner closely with engineering, design, and data teams to ship high-impact products\n- Define and track success metrics for merchant platform adoption and engagement',
    requirements: 'Technical education (CS, EE, etc.) or experience building online merchant products or eCommerce products. Strong architectural understanding of APIs, mobile and web products. Superior verbal and written communication skills and interpersonal skills, along with excellent analytical skills and a data-informed approach. Experience integrating multi-channel listers for eCommerce merchants is highly desirable. Experience building plugin integrations into platforms such as Shopify is also highly desirable.',
    benefits: ['Competitive salary + equity', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Commuter benefits', 'Miami office with ocean views'],
    schedule: 'Full-time. On-site at Miami, FL office.',
    applicationCount: 52,
    status: 'active',
    promoted: true,
    promotionDays: 7,
  },
  {
    title: 'Senior DevOps Engineer',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'tech',
    payType: 'salary',
    payMin: 140000,
    payMax: 190000,
    location: 'Miami, FL',
    remote: false,
    description: 'OfferUp is looking for an experienced Senior DevOps/System Engineer to join our highly motivated engineering team in Miami. You will be responsible for leading key projects in design, development, and post-release support of tools used by a variety of internal teams.\n\nResponsibilities:\n- Lead key projects in design, development, and post-release support of internal tools and infrastructure\n- Evaluate new technologies to solve problems as needed and play a significant role in architectural direction\n- Build and maintain compute capacity in a fast-paced environment\n- Design and implement CI/CD pipelines, monitoring, and alerting systems\n- Collaborate with engineering teams across OfferUp to improve developer experience and operational reliability\n- Mentor junior engineers and contribute to team growth',
    requirements: 'BS or MS in Computer Science, Computer/Software Engineering, Information Systems/Technology, or a related discipline. Strong working experience with Linux Systems Administration and Troubleshooting, strong knowledge of Linux internals. Good experience in programming languages such as Kotlin, Shell, Python, etc. Demonstrated experience in solving infrastructure-related problems with code. Mastery of building compute capacity in a fast-paced environment.',
    benefits: ['Competitive salary + equity', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Professional development budget', 'Team building events'],
    schedule: 'Full-time. On-site at Miami, FL office.',
    applicationCount: 38,
    status: 'active',
    promoted: false,
  },
  {
    title: 'Engineering Manager – Merchant',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'tech',
    payType: 'salary',
    payMin: 190000,
    payMax: 260000,
    location: 'Miami, FL',
    remote: false,
    description: 'We\'re looking for an Engineering Manager to lead our Merchant engineering team in Miami. You\'ll build and grow a high-performing team while driving the technical vision for OfferUp\'s merchant platform.\n\nResponsibilities:\n- Build and lead engineering team in achieving a high level of technical quality, reliability, and ease-of-use\n- Own, oversee, and delegate the design, architecture, development, testing, deployment, and delivery of large-scale software applications, systems, platforms, services or technologies\n- Recruit great engineers in collaboration with OfferUp\'s recruiting team\n- Develop engineers on the team, helping them advance in their careers\n- Champion operational excellence, establishing metrics and process for regular assessment and improvement\n- Partner with Product and Design to define and deliver the merchant platform roadmap',
    requirements: 'Exceptional coding abilities and experience with architectural patterns of large, high-scale applications. A track record of partnering with recruiting to build incredible engineering teams. Proven experience managing and growing software engineering teams. Strong communication skills and ability to work cross-functionally with product, design, and data teams. Experience building B2B or marketplace platforms is a plus.',
    benefits: ['Competitive salary + equity', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Leadership development opportunities', 'Relocation assistance'],
    schedule: 'Full-time. On-site at Miami, FL office.',
    applicationCount: 27,
    status: 'active',
    promoted: false,
  },
  {
    title: 'Program Specialist',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'admin',
    payType: 'salary',
    payMin: 85000,
    payMax: 120000,
    location: 'Miami, FL',
    remote: false,
    description: 'OfferUp is seeking a Program Specialist skilled in both technical and operational project management, and who is passionate about delivering results while advocating for the customer experience.\n\nResponsibilities:\n- Support and assist engineering teams\' projects and agile ceremonies\n- Ensure the organization\'s strategic direction is reflected in projects and help provide the means and tools for OfferUp to successfully manage projects\n- Remove obstacles, communicate progress to all stakeholders, and ensure the big picture stays in focus while diving into details on specific issues\n- Develop a broad understanding of the business in order to drive alignment across teams\n- Partner with Product, Engineering, and domain subject matter experts to ensure requirements are captured\n- Develop and deliver project documentation, supporting materials, and project plans to internal teams and senior leaders throughout the project lifecycle',
    requirements: 'Flexible, humble, and have great judgment. Great at spotting issues, and adept at managing relationships up, down, and across organizations. Adaptable, resilient, and eager to tackle unfamiliar situations with curiosity and tenacity. Experience with agile methodologies and project management tools. Strong written and verbal communication skills. 3+ years in a program management, project management, or similar role.',
    benefits: ['Competitive salary + equity', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Professional development budget'],
    schedule: 'Full-time. On-site at Miami, FL office.',
    applicationCount: 44,
    status: 'active',
    promoted: false,
  },
  {
    title: 'Data Scientist (New in Career)',
    companyName: 'OfferUp',
    jobType: 'full_time',
    jobCategory: 'tech',
    payType: 'salary',
    payMin: 95000,
    payMax: 130000,
    location: 'Bellevue, WA',
    remote: true,
    description: 'OfferUp is looking for a Data Scientist to join our small, agile Data Science team. This is an exciting opportunity for someone early in their career with a passion for diving deep into complex data sources to drive actionable recommendations.\n\nResponsibilities:\n- Learn from experienced Senior Data Scientists to develop, implement, test and deploy machine learning models\n- Use Python and SQL to analyze large amounts of data\n- Help the team make progress on key deliverables by being part of project plans, features and solving problems\n- Play a part to identify, analyze, mitigate project risks, and remove blockers\n- Build and maintain data pipelines and dashboards to support decision-making\n- Present findings and recommendations to cross-functional stakeholders',
    requirements: 'Strong communication skills with proven ability to collaborate effectively with multidisciplinary teams. Desire to learn and grow with an experienced team. Demonstrated knowledge in Machine Learning algorithms; experience with modeling in Python, and data manipulation in SQL. Early in career, 1-2 years of professional data science experience. Familiarity with cloud platforms (AWS, GCP) is a plus.',
    benefits: ['Competitive salary + equity', 'Fully remote option or Bellevue office', 'Health, dental, and vision insurance', 'Unlimited PTO', '401(k) with company match', 'Learning and development stipend', 'Home office setup allowance'],
    schedule: 'Full-time. Remote or on-site at Bellevue, WA headquarters. Core collaboration hours 10am-3pm PT.',
    applicationCount: 71,
    status: 'active',
    promoted: false,
  },
];

export const mockJobs: Job[] = jobData.map((item, i) => ({
  id: `job-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  ...item,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 3) + 1)}-${String((i * 4 % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
}));

// === Job Analytics ===
function generateJobDailyMetrics(days: number, baseViews: number, promoted: boolean): JobDailyMetric[] {
  const metrics: JobDailyMetric[] = [];
  const startDate = new Date('2026-02-24');
  const promotionMultiplier = promoted ? 1.8 : 1;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
    const trendMultiplier = 1 + (i / days) * 0.2;
    const noise = 0.75 + (((i * 7 + 13) % 20) / 20) * 0.5;

    const views = Math.round(baseViews * weekendMultiplier * trendMultiplier * noise * promotionMultiplier);
    const clickRate = 0.15 + (((i * 3 + 7) % 15) / 15) * 0.15;
    const clicks = Math.round(views * clickRate);
    const applicationRate = 0.03 + (((i * 11 + 3) % 10) / 10) * 0.05;
    const applications = Math.round(clicks * applicationRate);

    metrics.push({
      date: date.toISOString().split('T')[0],
      views,
      clicks,
      applications,
    });
  }
  return metrics;
}

export const mockJobAnalytics: Record<string, JobAnalytics> = {};
mockJobs.forEach((job) => {
  const days = 30;
  const baseViews = job.status === 'closed' ? 80 : job.jobType === 'full_time' ? 200 : 120;
  const dailyMetrics = generateJobDailyMetrics(days, baseViews, job.promoted);

  const totalViews = dailyMetrics.reduce((sum, d) => sum + d.views, 0);
  const totalClicks = dailyMetrics.reduce((sum, d) => sum + d.clicks, 0);
  const totalApplications = dailyMetrics.reduce((sum, d) => sum + d.applications, 0);

  mockJobAnalytics[job.id] = {
    jobId: job.id,
    summary: {
      totalViews,
      totalClicks,
      totalApplications,
      ctr: totalViews > 0 ? Math.round((totalClicks / totalViews) * 10000) / 100 : 0,
      conversionRate: totalClicks > 0 ? Math.round((totalApplications / totalClicks) * 10000) / 100 : 0,
    },
    dailyMetrics,
  };
});

// === Rentals ===
const rentalData: { title: string; description: string; propertyType: PropertyType; rent: number; bedrooms: number; bathrooms: number; sqft: number; petPolicy: PetPolicy; availableDate: string; leaseTerm: LeaseTerm; amenities: string[]; location: string; status: 'active' | 'rented' | 'draft'; promoted: boolean; promotionDays?: number; inquiryCount: number }[] = [
  {
    title: 'Spacious 2BR Capitol Hill Apt',
    description: 'Bright, recently updated 2-bedroom apartment in the heart of Capitol Hill. Walking distance to Broadway shops, restaurants, and nightlife.\n\nUnit features:\n- Hardwood floors throughout\n- Updated kitchen with stainless steel appliances\n- Large living room with south-facing windows\n- In-unit washer/dryer\n- Private balcony with city views\n- Central AC and heating\n- One reserved parking spot included\n\nBuilding amenities include a rooftop deck, package lockers, and bike storage. Water/sewer/garbage included in rent. Cat-friendly (dogs case by case with deposit).',
    propertyType: 'apartment', rent: 2200, bedrooms: 2, bathrooms: 1, sqft: 950, petPolicy: 'allowed', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['In-Unit Laundry', 'Dishwasher', 'AC', 'Balcony'], location: 'Seattle, WA', status: 'active', promoted: true, promotionDays: 7, inquiryCount: 34,
  },
  {
    title: 'Cozy Studio Downtown',
    description: 'Modern studio in a luxury high-rise in the heart of downtown Seattle. Floor-to-ceiling windows with stunning Puget Sound and Olympic Mountain views.\n\nUnit features:\n- Open floor plan with built-in murphy bed\n- Quartz countertops and modern cabinetry\n- Full-size appliances including dishwasher\n- Walk-in closet\n- Central AC\n\nBuilding amenities: 24-hour concierge, fitness center, rooftop terrace, resident lounge, EV charging stations, and underground parking ($150/mo extra). Steps from Pike Place Market and the waterfront.',
    propertyType: 'studio', rent: 1450, bedrooms: 0, bathrooms: 1, sqft: 480, petPolicy: 'not_allowed', availableDate: '2026-04-15', leaseTerm: '1_year', amenities: ['Gym', 'Parking', 'AC', 'Storage'], location: 'Seattle, WA', status: 'active', promoted: true, promotionDays: 5, inquiryCount: 21,
  },
  {
    title: '3BR House with Yard - Ballard',
    description: 'Charming 3-bedroom craftsman house with a large, fenced backyard and detached 2-car garage. Quiet, tree-lined residential street in the heart of Ballard.\n\nHome features:\n- Refinished hardwood floors\n- Updated kitchen with gas range and granite countertops\n- Spacious living room with original fireplace\n- Full basement with additional storage\n- Large fenced backyard — great for pets and entertaining\n- Detached 2-car garage with opener\n\nWalking distance to Ballard Farmers Market, breweries, and shopping on Market Street. Excellent public transit access. Tenant responsible for utilities and yard maintenance.',
    propertyType: 'house', rent: 3200, bedrooms: 3, bathrooms: 2, sqft: 1600, petPolicy: 'allowed', availableDate: '2026-05-01', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'Storage'], location: 'Seattle, WA', status: 'active', promoted: false, inquiryCount: 18,
  },
  {
    title: 'Modern 1BR Condo - Pearl District',
    description: 'Sleek one-bedroom condo in Portland\'s premier Pearl District. Walk to restaurants, galleries, Powell\'s Books, and the Streetcar.\n\nUnit features:\n- Open-concept living/dining with floor-to-ceiling windows\n- Modern kitchen with stainless steel appliances and in-unit washer/dryer\n- Bedroom with large closet\n- Central AC and heating\n- One parking space in secure garage\n\nBuilding amenities: fitness center, rooftop pool, resident lounge, and secure package room. Water/sewer/garbage included. Pet-friendly on case-by-case basis with deposit.',
    propertyType: 'condo', rent: 1800, bedrooms: 1, bathrooms: 1, sqft: 720, petPolicy: 'case_by_case', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['In-Unit Laundry', 'Dishwasher', 'AC', 'Gym', 'Pool'], location: 'Portland, OR', status: 'active', promoted: false, inquiryCount: 15,
  },
  {
    title: 'Furnished Room in Shared House',
    description: 'Private furnished room in a friendly shared house near Alberta Arts District. Great for someone new to Portland or looking for an affordable, community-oriented living situation.\n\nRoom includes:\n- Full-size bed, desk, and dresser\n- Closet with organizer\n- Locking door for privacy\n\nShared spaces:\n- Full kitchen (well-stocked with cookware)\n- Living room with TV and couch\n- Bathroom (shared with one other housemate)\n- Backyard with garden\n- Shared laundry in basement\n\nUtilities included in rent (water, electric, gas, Wi-Fi). Currently 3 housemates, all professionals ages 25-35. No smoking, no pets.',
    propertyType: 'room', rent: 750, bedrooms: 1, bathrooms: 1, sqft: 200, petPolicy: 'not_allowed', availableDate: '2026-03-25', leaseTerm: 'month_to_month', amenities: ['Shared Laundry', 'Parking'], location: 'Portland, OR', status: 'active', promoted: false, inquiryCount: 9,
  },
  {
    title: '2BR Townhouse - Inner Sunset',
    description: 'Two-story townhouse with a private patio in San Francisco\'s charming Inner Sunset neighborhood. Close to Golden Gate Park, UCSF, and the N-Judah Muni line.\n\nUnit features:\n- Open-concept main level with kitchen, dining, and living room\n- Two bedrooms upstairs with ample closet space\n- Half bath on main level, full bath upstairs\n- In-unit washer/dryer\n- Private rear patio\n- 1-car garage with additional storage\n\nNewly painted with new carpet upstairs. Hardwood on the main level. Close to Irving Street shops and restaurants. Tenant pays electric and gas; water included.',
    propertyType: 'townhouse', rent: 3500, bedrooms: 2, bathrooms: 1.5, sqft: 1100, petPolicy: 'allowed', availableDate: '2026-05-15', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'Balcony', 'Storage'], location: 'San Francisco, CA', status: 'active', promoted: false, inquiryCount: 12,
  },
  {
    title: 'Budget 1BR Near University',
    description: 'Affordable one-bedroom apartment near Portland State University campus. Ideal for students or young professionals on a budget.\n\nUnit features:\n- Separate bedroom and living area\n- Galley kitchen with range and refrigerator\n- Full bathroom with tub/shower combo\n- AC window unit\n- Shared coin-op laundry in building\n\nClose to campus, MAX light rail, and downtown Portland. Rent includes water and garbage. Electric paid by tenant. No pets, no smoking.',
    propertyType: 'apartment', rent: 1100, bedrooms: 1, bathrooms: 1, sqft: 550, petPolicy: 'not_allowed', availableDate: '2026-06-01', leaseTerm: '6_months', amenities: ['Shared Laundry', 'AC'], location: 'Portland, OR', status: 'draft', promoted: false, inquiryCount: 0,
  },
  {
    title: 'Luxury 2BR Waterfront Condo',
    description: 'Premium waterfront living with panoramic Lake Union views. This luxury condo offers concierge service, a rooftop deck, and top-of-the-line finishes throughout.\n\nUnit features:\n- 180-degree lake and skyline views\n- Chef\'s kitchen with Sub-Zero fridge and Wolf range\n- Primary suite with walk-in closet and spa-like bath\n- Second bedroom with en-suite bath\n- In-unit laundry (full-size)\n- Floor-to-ceiling windows throughout\n- Two parking spaces in secured garage\n- Private storage unit\n\nBuilding amenities: 24-hour concierge, fitness center, lap pool, hot tub, rooftop entertaining deck, EV charging. Walking distance to South Lake Union tech campus.',
    propertyType: 'condo', rent: 4200, bedrooms: 2, bathrooms: 2, sqft: 1300, petPolicy: 'case_by_case', availableDate: '2026-04-01', leaseTerm: '1_year', amenities: ['Parking', 'In-Unit Laundry', 'Dishwasher', 'AC', 'Gym', 'Pool', 'Balcony', 'EV Charging'], location: 'Seattle, WA', status: 'rented', promoted: false, inquiryCount: 52,
  },
];

export const mockRentals: Rental[] = rentalData.map((item, i) => ({
  id: `rental-${String(i + 1).padStart(3, '0')}`,
  userId: 'user-001',
  ...item,
  imageUrl: `https://picsum.photos/seed/rental${i + 1}/400/300`,
  createdAt: `2026-0${Math.min(3, Math.floor(i / 3) + 1)}-${String((i * 3 % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  promotionDate: item.promoted ? '2026-03-15T00:00:00Z' : undefined,
}));

// === Rental Analytics ===
function generateRentalDailyMetrics(days: number, baseViews: number, promoted: boolean): RentalDailyMetric[] {
  const metrics: RentalDailyMetric[] = [];
  const startDate = new Date('2026-02-24');
  const promotionMultiplier = promoted ? 2.0 : 1;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1;
    const trendMultiplier = 1 + (i / days) * 0.2;
    const noise = 0.75 + (((i * 7 + 13) % 20) / 20) * 0.5;

    const views = Math.round(baseViews * weekendMultiplier * trendMultiplier * noise * promotionMultiplier);
    const clickRate = 0.10 + (((i * 3 + 7) % 15) / 15) * 0.10;
    const clicks = Math.round(views * clickRate);
    const inquiryRate = 0.05 + (((i * 11 + 3) % 10) / 10) * 0.07;
    const inquiries = Math.round(clicks * inquiryRate);

    metrics.push({ date: date.toISOString().split('T')[0], views, clicks, inquiries });
  }
  return metrics;
}

export const mockRentalAnalytics: Record<string, RentalAnalytics> = {};
mockRentals.forEach((rental) => {
  const days = 30;
  const baseViews = rental.status === 'rented' ? 60 : rental.rent > 3000 ? 250 : 180;
  const dailyMetrics = generateRentalDailyMetrics(days, baseViews, rental.promoted);

  const totalViews = dailyMetrics.reduce((sum, d) => sum + d.views, 0);
  const totalClicks = dailyMetrics.reduce((sum, d) => sum + d.clicks, 0);
  const totalInquiries = dailyMetrics.reduce((sum, d) => sum + d.inquiries, 0);

  mockRentalAnalytics[rental.id] = {
    rentalId: rental.id,
    summary: {
      totalViews,
      totalClicks,
      totalInquiries,
      ctr: totalViews > 0 ? Math.round((totalClicks / totalViews) * 10000) / 100 : 0,
      conversionRate: totalClicks > 0 ? Math.round((totalInquiries / totalClicks) * 10000) / 100 : 0,
    },
    dailyMetrics,
  };
});
