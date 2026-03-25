'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { useRentalsStore } from '@/store/rentals-store';
import { PROPERTY_TYPES } from '@/lib/constants';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { PropertyType } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'text-green-700', dot: 'bg-green-500' },
  rented: { label: 'Rented', color: 'text-gray-500', dot: 'bg-gray-400' },
  draft: { label: 'Draft', color: 'text-yellow-700', dot: 'bg-yellow-500' },
};

export default function RentalsPage() {
  const { rentals, togglePromotion } = useRentalsStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | PropertyType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rent-asc' | 'rent-desc'>('newest');

  const types = useMemo(() => {
    const used = new Set(rentals.map((r) => r.propertyType));
    return PROPERTY_TYPES.filter((t) => used.has(t.value));
  }, [rentals]);

  const filtered = useMemo(() => {
    let result = [...rentals];
    if (typeFilter !== 'all') result = result.filter((r) => r.propertyType === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (sortBy === 'rent-asc') result.sort((a, b) => a.rent - b.rent);
    else if (sortBy === 'rent-desc') result.sort((a, b) => b.rent - a.rent);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [rentals, typeFilter, search, sortBy]);

  const activeCount = rentals.filter((r) => r.status === 'active').length;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">My Rentals</h1>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <button onClick={() => setTypeFilter('all')} className={cn(
          'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          typeFilter === 'all' ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        )}>All</button>
        {types.map((t) => (
          <button key={t.value} onClick={() => setTypeFilter(t.value)} className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            typeFilter === t.value ? 'bg-offerup-green text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          )}>{t.label}</button>
        ))}
        <button className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-gray-400 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <span>Rentals: <strong className="text-gray-800">{rentals.length}</strong></span>
        <span>Active: <strong className="text-gray-800">{activeCount}</strong></span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search rentals..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none" />
        </div>
        <div className="relative">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | PropertyType)}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none">
            <option value="all">All</option>
            {PROPERTY_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'rent-asc' | 'rent-desc')}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none">
            <option value="newest">Newest first</option>
            <option value="rent-asc">Rent: Low to High</option>
            <option value="rent-desc">Rent: High to Low</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Property</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Rent</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Beds/Baths</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Available</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((rental) => {
              const status = statusConfig[rental.status] ?? statusConfig.active;
              const typeLabel = PROPERTY_TYPES.find((t) => t.value === rental.propertyType)?.label ?? rental.propertyType;
              return (
                <tr key={rental.id} className="hover:bg-gray-50 transition-colors">
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
                      <div>
                        <span className="font-medium text-gray-800 truncate max-w-[180px] block">{rental.title}</span>
                        <span className="text-xs text-gray-400">{rental.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{typeLabel}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatCurrency(rental.rent)}/mo</td>
                  <td className="px-4 py-3 text-gray-500">{rental.bedrooms} bd / {rental.bathrooms} ba</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(rental.availableDate)}</td>
                  <td className="px-4 py-3">
                    {rental.promoted ? (
                      <button onClick={() => togglePromotion(rental.id)} className="text-xs font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">Remove promotion</button>
                    ) : (
                      <button onClick={() => togglePromotion(rental.id)} className="rounded-md border border-offerup-green px-3 py-1 text-xs font-medium text-offerup-green hover:bg-offerup-green-light transition-colors">Promote</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No rentals found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
