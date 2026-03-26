'use client';

import Link from 'next/link';
import { Package, Briefcase, Wrench, Home, TrendingUp, Eye, MousePointerClick, BarChart3, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockListings, mockJobs, mockServices, mockRentals, mockJobAnalytics, mockServiceAnalytics, mockRentalAnalytics, mockCampaigns } from '@/lib/mock-data';

type CategoryType = 'all' | 'listing' | 'job' | 'service' | 'rental';

interface UnifiedListing {
  id: string;
  title: string;
  category: CategoryType;
  status: string;
  createdAt: string;
  promoted: boolean;
  views: number;
  clicks: number;
  conversions: number;
  conversionLabel: string;
  href: string;
  performanceHref: string;
}

function buildUnifiedListings(): UnifiedListing[] {
  const items: UnifiedListing[] = [];

  mockListings.forEach((l) => {
    const campaign = mockCampaigns.find((c) => c.listingIds?.includes(l.id));
    const views = campaign ? campaign.impressions : 0;
    const clicks = campaign ? campaign.clicks : 0;
    items.push({
      id: l.id,
      title: l.title,
      category: 'listing',
      status: l.status,
      createdAt: l.createdAt,
      promoted: l.promoted,
      views,
      clicks,
      conversions: 0,
      conversionLabel: 'Sales',
      href: `/portal/listings`,
      performanceHref: `/portal/listings`,
    });
  });

  mockJobs.forEach((j) => {
    const analytics = mockJobAnalytics[j.id];
    items.push({
      id: j.id,
      title: j.title,
      category: 'job',
      status: j.status,
      createdAt: j.createdAt,
      promoted: j.promoted,
      views: analytics?.summary.totalViews ?? 0,
      clicks: analytics?.summary.totalClicks ?? 0,
      conversions: analytics?.summary.totalApplications ?? 0,
      conversionLabel: 'Applications',
      href: `/portal/jobs/${j.id}`,
      performanceHref: `/portal/jobs/${j.id}/performance`,
    });
  });

  mockServices.forEach((s) => {
    const analytics = mockServiceAnalytics[s.id];
    items.push({
      id: s.id,
      title: s.title,
      category: 'service',
      status: s.status,
      createdAt: s.createdAt,
      promoted: s.promoted,
      views: analytics?.summary.totalViews ?? 0,
      clicks: analytics?.summary.totalClicks ?? 0,
      conversions: analytics?.summary.totalInquiries ?? 0,
      conversionLabel: 'Inquiries',
      href: `/portal/services/${s.id}`,
      performanceHref: `/portal/services/${s.id}/performance`,
    });
  });

  mockRentals.forEach((r) => {
    const analytics = mockRentalAnalytics[r.id];
    items.push({
      id: r.id,
      title: r.title,
      category: 'rental',
      status: r.status,
      createdAt: r.createdAt,
      promoted: r.promoted,
      views: analytics?.summary.totalViews ?? 0,
      clicks: analytics?.summary.totalClicks ?? 0,
      conversions: analytics?.summary.totalInquiries ?? 0,
      conversionLabel: 'Inquiries',
      href: `/portal/rentals/${r.id}`,
      performanceHref: `/portal/rentals/${r.id}/performance`,
    });
  });

  return items;
}

const categoryConfig: Record<CategoryType, { label: string; icon: typeof Package; color: string; bg: string }> = {
  all: { label: 'All', icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
  listing: { label: 'Listings', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  job: { label: 'Jobs', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  service: { label: 'Services', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
  rental: { label: 'Rentals', icon: Home, color: 'text-teal-600', bg: 'bg-teal-50' },
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PortalHomePage() {
  const allItems = buildUnifiedListings();

  const totalViews = allItems.reduce((sum, i) => sum + i.views, 0);
  const totalClicks = allItems.reduce((sum, i) => sum + i.clicks, 0);
  const totalConversions = allItems.reduce((sum, i) => sum + i.conversions, 0);
  const activeCount = allItems.filter((i) => i.status === 'active').length;
  const promotedCount = allItems.filter((i) => i.promoted).length;

  const summaryCards = [
    { label: 'Total Listings', value: allItems.length, icon: Package, color: 'text-offerup-green' },
    { label: 'Active', value: activeCount, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Promoted', value: promotedCount, icon: ArrowUpRight, color: 'text-purple-600' },
    { label: 'Total Views', value: formatNumber(totalViews), icon: Eye, color: 'text-blue-600' },
    { label: 'Total Clicks', value: formatNumber(totalClicks), icon: MousePointerClick, color: 'text-amber-600' },
    { label: 'Conversions', value: formatNumber(totalConversions), icon: BarChart3, color: 'text-teal-600' },
  ];

  // Sort by views descending
  const sorted = [...allItems].sort((a, b) => b.views - a.views);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <card.icon size={16} className={card.color} />
              <span className="text-xs font-medium text-gray-500">{card.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(['listing', 'job', 'service', 'rental'] as CategoryType[]).map((cat) => {
          const config = categoryConfig[cat];
          const count = allItems.filter((i) => i.category === cat).length;
          const catViews = allItems.filter((i) => i.category === cat).reduce((s, i) => s + i.views, 0);
          return (
            <div key={cat} className={cn('flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm')}>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', config.bg)}>
                <config.icon size={18} className={config.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{count} {config.label}</p>
                <p className="text-xs text-gray-500">{formatNumber(catViews)} views</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Listings Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-800">All Listings</h2>
          <p className="text-sm text-gray-500">Performance across all categories</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Conv.</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((item) => {
                const config = categoryConfig[item.category];
                const ctr = item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={`${item.category}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={item.href} className="font-medium text-offerup-green hover:text-offerup-green-dark hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.bg, config.color)}>
                        <config.icon size={12} />
                        {config.label.replace(/s$/, '')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                        item.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                        item.status === 'sold' || item.status === 'rented' || item.status === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      )}>
                        {item.status}
                      </span>
                      {item.promoted && (
                        <span className="ml-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                          promoted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatNumber(item.views)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatNumber(item.clicks)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatNumber(item.conversions)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{ctr}%</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      {item.category !== 'listing' ? (
                        <Link href={item.performanceHref} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-offerup-green transition-colors">
                          <BarChart3 size={14} />
                        </Link>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
