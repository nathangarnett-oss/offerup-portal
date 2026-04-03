'use client';

import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Package, Briefcase, Wrench, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

type TimeRange = '6m' | '12m';

type SpendCategory = 'listings' | 'jobs' | 'services' | 'rentals';

interface MonthlySpend {
  month: string;       // "Oct 2025", "Nov 2025", etc.
  listings: number;
  jobs: number;
  services: number;
  rentals: number;
  total: number;
}

const categoryMeta: Record<SpendCategory, { label: string; color: string; hex: string; icon: typeof Package }> = {
  listings: { label: 'Listings', color: 'bg-blue-500', hex: '#3b82f6', icon: Package },
  jobs: { label: 'Jobs', color: 'bg-purple-500', hex: '#a855f7', icon: Briefcase },
  services: { label: 'Services', color: 'bg-amber-500', hex: '#f59e0b', icon: Wrench },
  rentals: { label: 'Rentals', color: 'bg-teal-500', hex: '#14b8a6', icon: Building2 },
};

// Generate 12 months of spend data ending in March 2026
function generateMonthlySpend(): MonthlySpend[] {
  const months: MonthlySpend[] = [];
  const startDate = new Date(2025, 3, 1); // April 2025

  // Seed-based pseudo-random for deterministic output
  let seed = 73;
  function rand() {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  }

  // Base monthly spend by category with seasonal trends
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // Seasonal multiplier: holiday bump in Nov-Dec, new year dip in Jan, spring ramp
    const monthNum = date.getMonth();
    let seasonal = 1.0;
    if (monthNum === 10) seasonal = 1.3;       // Nov
    else if (monthNum === 11) seasonal = 1.5;   // Dec
    else if (monthNum === 0) seasonal = 0.8;    // Jan
    else if (monthNum === 1) seasonal = 0.9;    // Feb
    else if (monthNum === 2) seasonal = 1.1;    // Mar

    // Growth trend: business scales up over the year
    const growthMultiplier = 1 + (i / 12) * 0.4;

    const noise = () => 0.85 + rand() * 0.3;

    const listings = Math.round(
      850 * seasonal * growthMultiplier * noise()
    );
    const jobs = Math.round(
      420 * seasonal * growthMultiplier * noise()
    );
    const services = Math.round(
      310 * seasonal * growthMultiplier * noise()
    );
    const rentals = Math.round(
      540 * seasonal * growthMultiplier * noise()
    );

    months.push({
      month: monthLabel,
      listings,
      jobs,
      services,
      rentals,
      total: listings + jobs + services + rentals,
    });
  }

  return months;
}

const allMonthlySpend = generateMonthlySpend();

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function SpendPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');

  const data = useMemo(() => {
    if (timeRange === '6m') return allMonthlySpend.slice(-6);
    return allMonthlySpend;
  }, [timeRange]);

  const totals = useMemo(() => {
    const t = { listings: 0, jobs: 0, services: 0, rentals: 0, total: 0 };
    data.forEach((m) => {
      t.listings += m.listings;
      t.jobs += m.jobs;
      t.services += m.services;
      t.rentals += m.rentals;
      t.total += m.total;
    });
    return t;
  }, [data]);

  const avgMonthly = Math.round(totals.total / data.length);

  const categoryCards: { key: SpendCategory; amount: number; pct: number }[] = (
    ['listings', 'jobs', 'services', 'rentals'] as SpendCategory[]
  ).map((key) => ({
    key,
    amount: totals[key],
    pct: totals.total > 0 ? Math.round((totals[key] / totals.total) * 100) : 0,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Spend Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total spend across all listing categories
          </p>
        </div>
        {/* Time range toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <button
            onClick={() => setTimeRange('6m')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              timeRange === '6m'
                ? 'bg-offerup-green text-white'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            Last 6 months
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200',
              timeRange === '12m'
                ? 'bg-offerup-green text-white'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Top-level summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <DollarSign size={14} className="text-offerup-green" />
            Total Spend
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-800">{formatCurrency(totals.total)}</p>
          <p className="mt-1 text-xs text-gray-400">
            {timeRange === '6m' ? 'Last 6 months' : 'Last 12 months'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <TrendingUp size={14} className="text-blue-500" />
            Avg Monthly
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-800">{formatCurrency(avgMonthly)}</p>
          <p className="mt-1 text-xs text-gray-400">per month average</p>
        </div>
        <div className="col-span-2 lg:col-span-1 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <DollarSign size={14} className="text-green-500" />
            Latest Month
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {formatCurrency(data[data.length - 1].total)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{data[data.length - 1].month}</p>
        </div>
      </div>

      {/* Category breakdown cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categoryCards.map(({ key, amount, pct }) => {
          const meta = categoryMeta[key];
          const Icon = meta.icon;
          return (
            <div key={key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', `bg-opacity-10`)} style={{ backgroundColor: `${meta.hex}18` }}>
                    <Icon size={16} style={{ color: meta.hex }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                </div>
                <span className="text-xs font-medium text-gray-400">{pct}%</span>
              </div>
              <p className="mt-3 text-xl font-bold text-gray-800">{formatCurrency(amount)}</p>
              {/* Mini progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: meta.hex }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stacked bar chart */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-bold text-gray-800">Monthly Spend by Category</h2>
        <p className="mb-4 text-sm text-gray-500">Stacked view of spend across all categories</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value, name) => [formatCurrency(value as number), categoryMeta[name as SpendCategory]?.label ?? name]}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                formatter={(value: string) => categoryMeta[value as SpendCategory]?.label ?? value}
              />
              <Bar dataKey="listings" stackId="spend" fill={categoryMeta.listings.hex} radius={[0, 0, 0, 0]} />
              <Bar dataKey="services" stackId="spend" fill={categoryMeta.services.hex} />
              <Bar dataKey="rentals" stackId="spend" fill={categoryMeta.rentals.hex} />
              <Bar dataKey="jobs" stackId="spend" fill={categoryMeta.jobs.hex} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual category bar charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(['listings', 'jobs', 'services', 'rentals'] as SpendCategory[]).map((key) => {
          const meta = categoryMeta[key];
          return (
            <div key={key} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                <span className={cn('h-3 w-3 rounded-full')} style={{ backgroundColor: meta.hex }} />
                {meta.label} Spend
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), meta.label]} />
                    <Bar dataKey={key} fill={meta.hex} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
