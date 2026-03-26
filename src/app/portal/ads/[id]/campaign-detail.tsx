'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useCampaignsStore } from '@/store/campaigns-store';
import { mockCampaignAnalytics } from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatDateLong, cn } from '@/lib/utils';
import {
  ArrowLeft,
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Target,
  Calendar,
  MapPin,
  Layers,
  Pause,
  Play,
  Square,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CampaignStatus } from '@/lib/types';

const statusConfig: Record<CampaignStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
  paused: { label: 'Paused', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  ended: { label: 'Ended', bg: 'bg-gray-100', text: 'text-gray-600' },
  draft: { label: 'Draft', bg: 'bg-blue-100', text: 'text-blue-700' },
  scheduled: { label: 'Scheduled', bg: 'bg-purple-100', text: 'text-purple-700' },
};

export default function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { campaigns, pauseCampaign, resumeCampaign, endCampaign } = useCampaignsStore();

  const campaign = campaigns.find((c) => c.id === id);
  const analytics = mockCampaignAnalytics[id];

  const chartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.dailyMetrics.map((d) => ({
      date: d.date.slice(5),
      impressions: d.impressions,
      clicks: d.clicks,
      spend: d.spend,
      conversions: d.conversions,
    }));
  }, [analytics]);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500">Campaign not found.</p>
        <Link href="/portal/ads" className="mt-4 text-offerup-green hover:underline">
          Back to Ads Manager
        </Link>
      </div>
    );
  }

  const status = statusConfig[campaign.status];
  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00';
  const cpc = campaign.clicks > 0 ? (campaign.totalSpent / campaign.clicks).toFixed(2) : '0.00';
  const budgetPct = campaign.totalBudget > 0 ? (campaign.totalSpent / campaign.totalBudget) * 100 : 0;

  const metrics = [
    { label: 'Total Spend', value: formatCurrency(campaign.totalSpent), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Impressions', value: formatNumber(campaign.impressions), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Clicks', value: formatNumber(campaign.clicks), icon: MousePointerClick, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'CTR', value: `${ctr}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'CPC', value: `$${cpc}`, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Conversions', value: campaign.conversions.toString(), icon: Layers, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal/ads" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{campaign.name}</h1>
              <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', status.bg, status.text)}>
                {status.label}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {campaign.type === 'promoted_listing' ? 'Promoted Listing' : 'Display Ad'}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {formatDateLong(campaign.startDate)} — {formatDateLong(campaign.endDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'active' && (
            <>
              <button
                onClick={() => pauseCampaign(campaign.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-50"
              >
                <Pause size={16} />
                Pause
              </button>
              <button
                onClick={() => endCampaign(campaign.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Square size={16} />
                End Campaign
              </button>
            </>
          )}
          {campaign.status === 'paused' && (
            <button
              onClick={() => resumeCampaign(campaign.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-offerup-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
            >
              <Play size={16} />
              Resume
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Budget Usage</p>
          <p className="text-sm text-gray-500">
            {formatCurrency(campaign.totalSpent)} of {formatCurrency(campaign.totalBudget)} ({Math.round(budgetPct)}%)
          </p>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              budgetPct > 90 ? 'bg-red-500' : budgetPct > 70 ? 'bg-yellow-500' : 'bg-offerup-green'
            )}
            style={{ width: `${Math.min(budgetPct, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>Daily limit: {formatCurrency(campaign.dailyBudget)}/day</span>
          <span>{formatCurrency(campaign.totalBudget - campaign.totalSpent)} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{m.value}</p>
                </div>
                <div className={cn('rounded-lg p-2.5', m.bg)}>
                  <Icon size={20} className={m.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Performance Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00AB80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00AB80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6C757D' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E9ECEF',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="impressions" stroke="#00AB80" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="#6366F1" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Daily Spend</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6C757D' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6C757D' }} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spend']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E9ECEF' }}
                />
                <Bar dataKey="spend" fill="#00AB80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Daily Conversions</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6C757D' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6C757D' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E9ECEF' }} />
                <Bar dataKey="conversions" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Targeting</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targetCategories.map((cat) => (
                  <span key={cat} className="rounded-full bg-offerup-green-light px-3 py-1 text-xs font-medium text-offerup-green capitalize">
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">Locations</p>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targetLocations.map((loc) => (
                  <span key={loc} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    <MapPin size={12} />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Schedule & Placements</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">Schedule</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={14} className="text-gray-400" />
                {formatDateLong(campaign.startDate)} — {formatDateLong(campaign.endDate)}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">Placements</p>
              <div className="flex flex-wrap gap-1.5">
                {campaign.placements.map((p) => (
                  <span key={p} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 capitalize">
                    {p.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
