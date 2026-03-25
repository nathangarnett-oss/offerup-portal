'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useListingsStore } from '@/store/listings-store';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, Upload, Plus, X, CheckCircle } from 'lucide-react';
import type { ListingCategory } from '@/lib/types';

interface ListingDraft {
  title: string;
  description: string;
  price: string;
  category: ListingCategory | '';
  location: string;
}

const emptyDraft: ListingDraft = {
  title: '',
  description: '',
  price: '',
  category: '',
  location: LOCATIONS[0],
};

export default function CreateListingPage() {
  const router = useRouter();
  const { addListing } = useListingsStore();

  const [drafts, setDrafts] = useState<ListingDraft[]>([{ ...emptyDraft }]);
  const [submitted, setSubmitted] = useState(false);

  const updateDraft = (index: number, field: keyof ListingDraft, value: string) => {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const addDraft = () => {
    setDrafts((prev) => [...prev, { ...emptyDraft }]);
  };

  const removeDraft = (index: number) => {
    if (drafts.length <= 1) return;
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = (draft: ListingDraft) =>
    draft.title.trim() && draft.description.trim() && Number(draft.price) > 0 && draft.category;

  const allValid = drafts.every(isValid);

  const handleSubmit = () => {
    drafts.forEach((draft) => {
      if (isValid(draft)) {
        addListing({
          title: draft.title,
          description: draft.description,
          price: Number(draft.price),
          category: draft.category as ListingCategory,
          location: draft.location,
        });
      }
    });
    setSubmitted(true);
    setTimeout(() => router.push('/portal/listings'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-offerup-green-light mb-4">
          <CheckCircle size={32} className="text-offerup-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {drafts.length === 1 ? 'Listing Created!' : `${drafts.length} Listings Created!`}
        </h2>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your listings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal/listings')}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Listings</h1>
            <p className="text-sm text-gray-500">Add one or multiple listings at once</p>
          </div>
        </div>
        <button
          onClick={addDraft}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Plus size={16} />
          Add Another
        </button>
      </div>

      {drafts.map((draft, index) => (
        <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Listing {drafts.length > 1 ? `#${index + 1}` : 'Details'}
            </h2>
            {drafts.length > 1 && (
              <button
                onClick={() => removeDraft(index)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Photo Upload Area */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Photos</label>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-offerup-green hover:bg-offerup-green-light cursor-pointer">
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">Drop photos here or click to upload</p>
                  <p className="text-xs text-gray-400 mt-0.5">A placeholder image will be used for this demo</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => updateDraft(index, 'title', e.target.value)}
                placeholder="e.g. iPhone 15 Pro Max 256GB"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={draft.description}
                onChange={(e) => updateDraft(index, 'description', e.target.value)}
                placeholder="Describe your item in detail..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green resize-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(e) => updateDraft(index, 'price', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-4 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
              <select
                value={draft.category}
                onChange={(e) => updateDraft(index, 'category', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
              <select
                value={draft.location}
                onChange={(e) => updateDraft(index, 'location', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/portal/listings')}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allValid}
          className={cn(
            'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
            allValid
              ? 'bg-offerup-green hover:bg-offerup-green-dark'
              : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          {drafts.length === 1 ? 'Create Listing' : `Create ${drafts.length} Listings`}
        </button>
      </div>
    </div>
  );
}
