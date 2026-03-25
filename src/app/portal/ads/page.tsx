'use client';

import Link from 'next/link';
import { useCampaignsStore } from '@/store/campaigns-store';
import {
  getTotalAdSpendThisMonth,
  getTotalImpressions,
  getTotalClicks,
  getAvgCTR,
} from '@/lib/mock-data';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import {
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Pause,
  Play,
  ExternalLink,
  Megaphone,
  Monitor,
} from 'lucide-react';
import { useState } from 'react';
import type { CampaignStatus } from '@/lib/types';

const statusConfig: Record<CampaignStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
  paused: { label: 'Paused', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  ended: { label: 'Ended', bg: 'bg-gray-100', text: 'text-gray-600' },
  draft: { label: 'Draft', bg: 'bg-blue-100', text: 'text-blue-700' },
  scheduled: { label: 'Scheduled', bg: 'bg-purple-100', text: 'text-purple-700' },
};

type FilterTab = 'all' | 'active' | 'paused' | 'ended';

export default function AdsManagerPage() {
  const { campaigns, pauseCampaign, resumeCampaign } = useCampaignsStore();
  const [filter, setFilter] = useState<FilterTab>('all');

  const totalSpend = getTotalAdSpendThisMonth();
  const totalImpressions = getTotalImpressions();
  const totalClicks = getTotalClicks();
  const avgCTR = getAvgCTR();

  const filteredCampaigns =
    filter === 'all' ? campaigns : campaigns.filter((c) => c.status === filter);

  const metrics = [
    {
      label: 'Total Spend',
      value: formatCurrency(totalSpend),
      icon: DollarSign,
      accent: 'bg-green-500',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Impressions',
      value: formatNumber(totalImpressions),
      icon: Eye,
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Clicks',
      value: formatNumber(totalClicks),
      icon: MousePointerClick,
      accent: 'bg-purple-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Avg CTR',
      value: `${avgCTR}%`,
      icon: TrendingUp,
      accent: 'bg-orange-500',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'paused', label: 'Paused' },
    { key: 'ended', label: 'Ended' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Ads Manager</h1>
        <div className="flex gap-3">
          <Link
            href="/portal/ads/create-promoted"
            className="inline-flex items-center gap-2 rounded-lg bg-offerup-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            <Megaphone size={16} />
            Promote a Listing
          </Link>
          <Link
            href="/portal/ads/create-display"
            className="inline-flex items-center gap-2 rounded-lg bg-offerup-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            <Monitor size={16} />
            Create Display Ad
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className={cn('absolute left-0 top-0 h-full w-1 rounded-l-xl', m.accent)} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{m.value}</p>
                </div>
                <div className={cn('rounded-lg p-2.5', m.iconBg)}>
                  <Icon size={20} className={m.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              filter === tab.key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Campaign Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Budget</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Impressions</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Clicks</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">CTR</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => {
              const status = statusConfig[campaign.status];
              const budgetPct = campaign.totalBudget > 0 ? (campaign.totalSpent / campaign.totalBudget) * 100 : 0;
              const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00';

              return (
                <tr key={campaign.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{campaign.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {campaign.type === 'promoted_listing' ? 'Promoted' : 'Display'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', status.bg, status.text)}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{formatCurrency(campaign.totalSpent)}</span>
                        <span>{formatCurrency(campaign.totalBudget)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-offerup-green transition-all"
                          style={{ width: `${Math.min(budgetPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatNumber(campaign.impressions)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatNumber(campaign.clicks)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{ctr}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {(campaign.status === 'active' || campaign.status === 'paused') && (
                        <button
                          onClick={() =>
                            campaign.status === 'active'
                              ? pauseCampaign(campaign.id)
                              : resumeCampaign(campaign.id)
                          }
                          className={cn(
                            'rounded-lg p-1.5 transition-colors',
                            campaign.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          )}
                          title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      )}
                      <Link
                        href={`/portal/ads/${campaign.id}`}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        title="View details"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  No campaigns found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
