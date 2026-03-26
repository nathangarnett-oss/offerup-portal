'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useRentalsStore } from '@/store/rentals-store';
import { mockRentalAnalytics } from '@/lib/mock-data';
import { PROPERTY_TYPES } from '@/lib/constants';
import { formatNumber, formatCurrency, formatDateLong, cn } from '@/lib/utils';
import {
  ArrowLeft,
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  Percent,
  MapPin,
  Calendar,
  Home,
  Building2,
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
import type { RentalStatus } from '@/lib/types';

const statusConfig: Record<RentalStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
  rented: { label: 'Rented', bg: 'bg-gray-100', text: 'text-gray-600' },
  draft: { label: 'Draft', bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

export default function RentalPerformancePage() {
  const params = useParams();
  const router = useRouter();
  const { rentals } = useRentalsStore();

  const rental = rentals.find((r) => r.id === params.id);
  const analytics = mockRentalAnalytics[params.id as string];

  const chartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.dailyMetrics.map((d) => ({
      date: d.date.slice(5),
      views: d.views,
      clicks: d.clicks,
      inquiries: d.inquiries,
    }));
  }, [analytics]);

  if (!rental) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500">Rental not found.</p>
        <Link href="/portal/rentals" className="mt-4 text-offerup-green hover:underline">
          Back to My Rentals
        </Link>
      </div>
    );
  }

  const status = statusConfig[rental.status];
  const propertyTypeLabel = PROPERTY_TYPES.find((t) => t.value === rental.propertyType)?.label ?? rental.propertyType;

  const metrics = [
    { label: 'Total Views', value: formatNumber(analytics?.summary.totalViews ?? 0), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Clicks', value: formatNumber(analytics?.summary.totalClicks ?? 0), icon: MousePointerClick, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Inquiries', value: (analytics?.summary.totalInquiries ?? 0).toString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Click-Through Rate', value: `${analytics?.summary.ctr ?? 0}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Conversion Rate', value: `${analytics?.summary.conversionRate ?? 0}%`, icon: Percent, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Total Inquiries', value: (rental.inquiryCount ?? 0).toString(), icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/portal/rentals')} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{rental.title}</h1>
              <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', status.bg, status.text)}>
                {status.label}
              </span>
              {rental.promoted && (
                <span className="rounded-full bg-offerup-green-light px-2.5 py-0.5 text-xs font-semibold text-offerup-green">
                  Promoted
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {rental.location} &middot; Posted {formatDateLong(rental.createdAt)}
            </p>
          </div>
        </div>
        <Link
          href={`/portal/rentals/${rental.id}`}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          View Listing
        </Link>
      </div>

      {/* Rental info summary card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Home size={15} className="text-gray-400" />
            {propertyTypeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} className="text-gray-400" />
            {rental.location}
          </span>
          <span className="font-semibold text-gray-800">
            {formatCurrency(rental.rent)}/mo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building2 size={15} className="text-gray-400" />
            {rental.bedrooms} bed / {rental.bathrooms} bath
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={15} className="text-gray-400" />
            Available {formatDateLong(rental.availableDate)}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
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

      {/* Views & Clicks Over Time */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Views & Clicks Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRentalViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00AB80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00AB80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRentalClicks" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="views" stroke="#00AB80" fillOpacity={1} fill="url(#colorRentalViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="#6366F1" fillOpacity={1} fill="url(#colorRentalClicks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Inquiries & Daily Clicks */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Daily Inquiries</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6C757D' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6C757D' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E9ECEF' }} />
                <Bar dataKey="inquiries" fill="#00AB80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Daily Clicks</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6C757D' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6C757D' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E9ECEF' }} />
                <Bar dataKey="clicks" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
