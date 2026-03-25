'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { useListingsStore } from '@/store/listings-store';
import { CATEGORIES } from '@/lib/constants';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ListingCategory } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'text-green-700', dot: 'bg-green-500' },
  sold: { label: 'Sold', color: 'text-gray-500', dot: 'bg-gray-400' },
  draft: { label: 'Draft', color: 'text-yellow-700', dot: 'bg-yellow-500' },
  expired: { label: 'Expired', color: 'text-red-600', dot: 'bg-red-500' },
};

export default function ListingsPage() {
  const { listings, togglePromotion } = useListingsStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ListingCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const categories = useMemo(() => {
    const used = new Set(listings.map((l) => l.category));
    return CATEGORIES.filter((c) => used.has(c.value));
  }, [listings]);

  const filtered = useMemo(() => {
    let result = [...listings];

    if (categoryFilter !== 'all') {
      result = result.filter((l) => l.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());

    return result;
  }, [listings, categoryFilter, search, sortBy]);

  const activeCount = listings.filter((l) => l.status === 'active').length;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">My Listings</h1>

      {/* Category filter tabs */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            categoryFilter === 'all'
              ? 'bg-offerup-green text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              categoryFilter === cat.value
                ? 'bg-offerup-green text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            )}
          >
            {cat.label}
          </button>
        ))}
        <button className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-gray-400 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <span>
          Listings: <strong className="text-gray-800">{listings.length}</strong>
        </span>
        <span>
          Active: <strong className="text-gray-800">{activeCount}</strong>
        </span>
      </div>

      {/* Search + filter + sort */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | ListingCategory)}
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none"
          >
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
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

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Listing</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Price</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Post date</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((listing) => {
              const status = statusConfig[listing.status] ?? statusConfig.active;
              const catLabel = CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;

              return (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
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
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">{listing.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatCurrency(listing.price)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(listing.postDate)}</td>
                  <td className="px-4 py-3 text-gray-500">{catLabel}</td>
                  <td className="px-4 py-3">
                    {listing.promoted ? (
                      <button
                        onClick={() => togglePromotion(listing.id)}
                        className="text-xs font-medium text-offerup-green hover:text-offerup-green-dark transition-colors"
                      >
                        Remove promotion
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePromotion(listing.id)}
                        className="rounded-md border border-offerup-green px-3 py-1 text-xs font-medium text-offerup-green hover:bg-offerup-green-light transition-colors"
                      >
                        Promote
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
