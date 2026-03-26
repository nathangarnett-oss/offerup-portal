'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { useJobsStore } from '@/store/jobs-store';
import { JOB_CATEGORIES, JOB_TYPES, PAY_TYPES } from '@/lib/constants';
import { formatDate, cn } from '@/lib/utils';
import { JobCategory } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'text-green-700', dot: 'bg-green-500' },
  closed: { label: 'Closed', color: 'text-gray-500', dot: 'bg-gray-400' },
  draft: { label: 'Draft', color: 'text-yellow-700', dot: 'bg-yellow-500' },
};

function formatPay(payType: string, payMin: number, payMax: number): string {
  if (payType === 'salary') {
    return `$${Math.round(payMin / 1000)}K–$${Math.round(payMax / 1000)}K/yr`;
  }
  return `$${payMin}–$${payMax}/hr`;
}

export default function JobsPage() {
  const { jobs, togglePromotion } = useJobsStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | JobCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'pay-asc' | 'pay-desc'>('newest');

  const categories = useMemo(() => {
    const used = new Set(jobs.map((j) => j.jobCategory));
    return JOB_CATEGORIES.filter((c) => used.has(c.value));
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (categoryFilter !== 'all') result = result.filter((j) => j.jobCategory === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q));
    }
    if (sortBy === 'pay-asc') result.sort((a, b) => a.payMin - b.payMin);
    else if (sortBy === 'pay-desc') result.sort((a, b) => b.payMax - a.payMax);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [jobs, categoryFilter, search, sortBy]);

  const activeCount = jobs.filter((j) => j.status === 'active').length;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">My Jobs</h1>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <button onClick={() => setCategoryFilter('all')} className={cn(
          'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          categoryFilter === 'all' ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        )}>All</button>
        {categories.map((cat) => (
          <button key={cat.value} onClick={() => setCategoryFilter(cat.value)} className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            categoryFilter === cat.value ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          )}>{cat.label}</button>
        ))}
        <button className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-gray-400 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <span>Jobs: <strong className="text-gray-800">{jobs.length}</strong></span>
        <span>Active: <strong className="text-gray-800">{activeCount}</strong></span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none" />
        </div>
        <div className="relative">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as 'all' | JobCategory)}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none">
            <option value="all">All</option>
            {JOB_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'pay-asc' | 'pay-desc')}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none">
            <option value="newest">Newest first</option>
            <option value="pay-asc">Pay: Low to High</option>
            <option value="pay-desc">Pay: High to Low</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Job Title</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Pay</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Location</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((job) => {
              const status = statusConfig[job.status] ?? statusConfig.active;
              const typeLabel = JOB_TYPES.find((t) => t.value === job.jobType)?.label ?? job.jobType;
              return (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={cn('inline-block h-2 w-2 rounded-full', status.dot)} />
                      <span className={cn('text-xs font-medium', status.color)}>{status.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/portal/jobs/${job.id}`} className="font-medium text-offerup-green hover:text-offerup-green-dark truncate max-w-[200px] block">{job.title}</Link>
                    <span className="text-xs text-gray-400">{job.companyName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{typeLabel}</span>
                    {job.remote && <span className="ml-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Remote</span>}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatPay(job.payType, job.payMin, job.payMax)}</td>
                  <td className="px-4 py-3 text-gray-500">{job.location}</td>
                  <td className="px-4 py-3">
                    {job.promoted ? (
                      <button onClick={() => togglePromotion(job.id)} className="text-xs font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">Remove promotion</button>
                    ) : (
                      <button onClick={() => togglePromotion(job.id)} className="rounded-md border border-offerup-green px-3 py-1 text-xs font-medium text-offerup-green hover:bg-offerup-green-light transition-colors">Promote</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No jobs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
