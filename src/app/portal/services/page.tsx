'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { useServicesStore } from '@/store/services-store';
import { SERVICE_CATEGORIES, SERVICE_PRICING_MODELS } from '@/lib/constants';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ServiceCategory } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'text-green-700', dot: 'bg-green-500' },
  paused: { label: 'Paused', color: 'text-yellow-700', dot: 'bg-yellow-500' },
  draft: { label: 'Draft', color: 'text-gray-500', dot: 'bg-gray-400' },
};

function formatPricing(model: string, price: number): string {
  switch (model) {
    case 'hourly': return `${formatCurrency(price)}/hr`;
    case 'flat': return `${formatCurrency(price)} flat`;
    case 'starting_at': return `From ${formatCurrency(price)}`;
    case 'free_estimate': return 'Free Estimate';
    default: return formatCurrency(price);
  }
}

export default function ServicesPage() {
  const { services, togglePromotion } = useServicesStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ServiceCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const categories = useMemo(() => {
    const used = new Set(services.map((s) => s.serviceCategory));
    return SERVICE_CATEGORIES.filter((c) => used.has(c.value));
  }, [services]);

  const filtered = useMemo(() => {
    let result = [...services];
    if (categoryFilter !== 'all') result = result.filter((s) => s.serviceCategory === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [services, categoryFilter, search, sortBy]);

  const activeCount = services.filter((s) => s.status === 'active').length;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">My Services</h1>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            categoryFilter === 'all' ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          )}
        >All</button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              categoryFilter === cat.value ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            )}
          >{cat.label}</button>
        ))}
        <button className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-gray-400 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <span>Services: <strong className="text-gray-800">{services.length}</strong></span>
        <span>Active: <strong className="text-gray-800">{activeCount}</strong></span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | ServiceCategory)}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none"
          >
            <option value="all">All</option>
            {SERVICE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc')}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Service</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Pricing</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Area</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((service) => {
              const status = statusConfig[service.status] ?? statusConfig.active;
              const catLabel = SERVICE_CATEGORIES.find((c) => c.value === service.serviceCategory)?.label ?? service.serviceCategory;
              return (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={cn('inline-block h-2 w-2 rounded-full', status.dot)} />
                      <span className={cn('text-xs font-medium', status.color)}>{status.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-400">
                        <ImageIcon size={16} />
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">{service.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{catLabel}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatPricing(service.pricingModel, service.price)}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">{service.serviceArea[0]}</td>
                  <td className="px-4 py-3">
                    {service.promoted ? (
                      <button onClick={() => togglePromotion(service.id)} className="text-xs font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">Remove promotion</button>
                    ) : (
                      <button onClick={() => togglePromotion(service.id)} className="rounded-md border border-offerup-green px-3 py-1 text-xs font-medium text-offerup-green hover:bg-offerup-green-light transition-colors">Promote</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No services found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
