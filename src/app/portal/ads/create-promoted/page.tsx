'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useListingsStore } from '@/store/listings-store';
import { useCampaignsStore } from '@/store/campaigns-store';
import { LOCATIONS, CATEGORIES } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import type { ListingCategory } from '@/lib/types';

const STEPS = ['Select Listings', 'Targeting', 'Budget & Schedule', 'Review & Launch'];

export default function CreatePromotedListingPage() {
  const router = useRouter();
  const { listings } = useListingsStore();
  const { createCampaign } = useCampaignsStore();

  const [step, setStep] = useState(0);
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState(15);
  const [totalBudget, setTotalBudget] = useState(300);
  const [startDate, setStartDate] = useState('2026-03-19');
  const [endDate, setEndDate] = useState('2026-04-18');

  const activeListings = listings.filter((l) => l.status === 'active');
  const selectedListings = activeListings.filter((l) => selectedListingIds.includes(l.id));

  // Auto-fill categories from selected listings
  const autoCategories: ListingCategory[] = [
    ...new Set(selectedListings.map((l) => l.category)),
  ];
  const categoryLabels = autoCategories.map(
    (c) => CATEGORIES.find((cat) => cat.value === c)?.label || c
  );

  const toggleListing = (id: string) => {
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc]
    );
  };

  const canProceed = () => {
    if (step === 0) return selectedListingIds.length > 0;
    if (step === 1) return selectedLocations.length > 0;
    if (step === 2) return dailyBudget > 0 && totalBudget > 0 && startDate && endDate;
    return true;
  };

  const handleLaunch = () => {
    createCampaign({
      name: `Promoted - ${selectedListings.map((l) => l.title).join(', ').slice(0, 40)}`,
      type: 'promoted_listing',
      dailyBudget,
      totalBudget,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      targetCategories: autoCategories,
      targetLocations: selectedLocations,
      placements: ['search_results', 'category_page'],
      listingIds: selectedListingIds,
    });
    router.push('/portal/ads');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Promote a Listing</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                i < step
                  ? 'bg-offerup-green text-white'
                  : i === step
                  ? 'bg-offerup-green text-white ring-4 ring-offerup-green-light'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                i === step ? 'text-gray-800' : 'text-gray-400'
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Step 1: Select Listings */}
        {step === 0 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Select Listings to Promote</h2>
            <p className="mb-5 text-sm text-gray-500">
              Choose one or more active listings to promote. Selected: {selectedListingIds.length}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {activeListings.map((listing) => {
                const selected = selectedListingIds.includes(listing.id);
                return (
                  <button
                    key={listing.id}
                    onClick={() => toggleListing(listing.id)}
                    className={cn(
                      'relative overflow-hidden rounded-xl border-2 text-left transition-all',
                      selected
                        ? 'border-offerup-green shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {selected && (
                      <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-offerup-green text-white">
                        <Check size={14} />
                      </div>
                    )}
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 truncate">{listing.title}</p>
                      <p className="text-sm font-bold text-offerup-green">{formatCurrency(listing.price)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Targeting */}
        {step === 1 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Targeting</h2>
            <p className="mb-5 text-sm text-gray-500">Categories are auto-filled from your selected listings.</p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Categories (auto-filled)</label>
              <div className="flex flex-wrap gap-2">
                {categoryLabels.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-offerup-green-light px-3 py-1 text-sm font-medium text-offerup-green"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Target Locations</label>
              <div className="grid grid-cols-3 gap-2">
                {LOCATIONS.map((loc) => {
                  const selected = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        selected
                          ? 'border-offerup-green bg-offerup-green-light text-offerup-green'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Schedule */}
        {step === 2 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Budget & Schedule</h2>
            <p className="mb-5 text-sm text-gray-500">Set your daily and total budget, plus campaign dates.</p>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Daily Budget: {formatCurrency(dailyBudget)}
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full accent-[#00AB80]"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>$5</span>
                  <span>$100</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Total Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min={50}
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-4 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Launch */}
        {step === 3 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Review & Launch</h2>
            <p className="mb-5 text-sm text-gray-500">Review your campaign settings before launching.</p>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Selected Listings ({selectedListings.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedListings.map((l) => (
                    <span key={l.id} className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 border border-gray-200">
                      {l.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Targeting</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Categories:</span> {categoryLabels.join(', ')}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Locations:</span> {selectedLocations.join(', ')}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Budget & Schedule</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><span className="font-medium">Daily Budget:</span> {formatCurrency(dailyBudget)}</p>
                  <p><span className="font-medium">Total Budget:</span> {formatCurrency(totalBudget)}</p>
                  <p><span className="font-medium">Start:</span> {startDate}</p>
                  <p><span className="font-medium">End:</span> {endDate}</p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Placements</h3>
                <p className="text-sm text-gray-700">Search Results, Category Pages</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : router.push('/portal/ads'))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
          {step > 0 ? 'Back' : 'Cancel'}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors',
              canProceed()
                ? 'bg-offerup-green hover:bg-offerup-green-dark'
                : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-2 rounded-lg bg-offerup-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            <Rocket size={16} />
            Launch Campaign
          </button>
        )}
      </div>
    </div>
  );
}
