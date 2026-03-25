'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaignsStore } from '@/store/campaigns-store';
import { CATEGORIES, LOCATIONS, AD_PLACEMENTS, CREATIVE_DIMENSIONS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, Rocket, Plus, Image } from 'lucide-react';
import type { ListingCategory, AdPlacement, CreativeType } from '@/lib/types';

const STEPS = ['Campaign Details', 'Select Creative', 'Placements', 'Targeting & Budget', 'Review & Launch'];

export default function CreateDisplayAdPage() {
  const router = useRouter();
  const { creatives, createCampaign, addCreative } = useCampaignsStore();

  const [step, setStep] = useState(0);

  // Step 1
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState<'awareness' | 'traffic' | 'conversions'>('awareness');

  // Step 2
  const [selectedCreativeId, setSelectedCreativeId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [newCreativeName, setNewCreativeName] = useState('');
  const [newCreativeDimIdx, setNewCreativeDimIdx] = useState(0);

  // Step 3
  const [selectedPlacements, setSelectedPlacements] = useState<AdPlacement[]>([]);

  // Step 4
  const [selectedCategories, setSelectedCategories] = useState<ListingCategory[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [totalBudget, setTotalBudget] = useState(500);
  const [startDate, setStartDate] = useState('2026-03-19');
  const [endDate, setEndDate] = useState('2026-04-18');

  const objectives = [
    { key: 'awareness' as const, label: 'Awareness', desc: 'Maximize brand visibility and reach' },
    { key: 'traffic' as const, label: 'Traffic', desc: 'Drive visitors to your listings' },
    { key: 'conversions' as const, label: 'Conversions', desc: 'Optimize for sales and leads' },
  ];

  const togglePlacement = (p: AdPlacement) => {
    setSelectedPlacements((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const toggleCategory = (c: ListingCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc]
    );
  };

  const handleUploadCreative = () => {
    if (!newCreativeName) return;
    const dim = CREATIVE_DIMENSIONS[newCreativeDimIdx];
    addCreative({
      name: newCreativeName,
      dimensions: dim.dimensions,
      type: dim.type as CreativeType,
    });
    setNewCreativeName('');
    setShowUpload(false);
  };

  const canProceed = () => {
    if (step === 0) return campaignName.trim().length > 0;
    if (step === 1) return selectedCreativeId !== null;
    if (step === 2) return selectedPlacements.length > 0;
    if (step === 3) return selectedCategories.length > 0 && selectedLocations.length > 0 && dailyBudget > 0 && totalBudget > 0;
    return true;
  };

  const handleLaunch = () => {
    createCampaign({
      name: campaignName,
      type: 'display_ad',
      dailyBudget,
      totalBudget,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      targetCategories: selectedCategories,
      targetLocations: selectedLocations,
      placements: selectedPlacements,
      creativeIds: selectedCreativeId ? [selectedCreativeId] : [],
    });
    router.push('/portal/ads');
  };

  const selectedCreative = creatives.find((c) => c.id === selectedCreativeId);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Display Ad</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
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
            <span className={cn('text-sm font-medium', i === step ? 'text-gray-800' : 'text-gray-400')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-6 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Step 1: Campaign Details */}
        {step === 0 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Campaign Details</h2>
            <p className="mb-5 text-sm text-gray-500">Name your campaign and choose an objective.</p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Spring Electronics Sale"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Objective</label>
                <div className="grid grid-cols-3 gap-3">
                  {objectives.map((obj) => (
                    <button
                      key={obj.key}
                      onClick={() => setObjective(obj.key)}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        objective === obj.key
                          ? 'border-offerup-green bg-offerup-green-light'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <p className="text-sm font-semibold text-gray-800">{obj.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{obj.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Creative */}
        {step === 1 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Select Creative</h2>
            <p className="mb-5 text-sm text-gray-500">Choose an existing creative or upload a new one.</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {creatives.map((creative) => (
                <button
                  key={creative.id}
                  onClick={() => { setSelectedCreativeId(creative.id); setShowUpload(false); }}
                  className={cn(
                    'relative overflow-hidden rounded-xl border-2 text-left transition-all',
                    selectedCreativeId === creative.id
                      ? 'border-offerup-green shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {selectedCreativeId === creative.id && (
                    <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-offerup-green text-white">
                      <Check size={14} />
                    </div>
                  )}
                  <img src={creative.imageUrl} alt={creative.name} className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{creative.name}</p>
                    <span className="inline-block mt-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {creative.dimensions}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {!showUpload ? (
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-offerup-green hover:text-offerup-green w-full justify-center"
              >
                <Plus size={16} />
                Upload New Creative
              </button>
            ) : (
              <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Creative Name</label>
                  <input
                    type="text"
                    value={newCreativeName}
                    onChange={(e) => setNewCreativeName(e.target.value)}
                    placeholder="e.g. Summer Banner"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Dimensions</label>
                  <select
                    value={newCreativeDimIdx}
                    onChange={(e) => setNewCreativeDimIdx(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green"
                  >
                    {CREATIVE_DIMENSIONS.map((dim, i) => (
                      <option key={dim.type} value={i}>
                        {dim.label} ({dim.dimensions})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUploadCreative}
                    disabled={!newCreativeName}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors',
                      newCreativeName
                        ? 'bg-offerup-green hover:bg-offerup-green-dark'
                        : 'bg-gray-300 cursor-not-allowed'
                    )}
                  >
                    Add Creative
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Placements */}
        {step === 2 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Ad Placements</h2>
            <p className="mb-5 text-sm text-gray-500">Choose where your ads will appear.</p>

            <div className="grid grid-cols-2 gap-4">
              {AD_PLACEMENTS.map((placement) => {
                const selected = selectedPlacements.includes(placement.value);
                return (
                  <button
                    key={placement.value}
                    onClick={() => togglePlacement(placement.value)}
                    className={cn(
                      'relative rounded-xl border-2 p-4 text-left transition-all',
                      selected
                        ? 'border-offerup-green bg-offerup-green-light'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {selected && (
                      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-offerup-green text-white">
                        <Check size={14} />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-gray-100 p-2">
                        <Image size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{placement.label}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{placement.description}</p>
                        <p className="mt-1.5 text-xs font-medium text-offerup-green">{placement.estimatedReach}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Targeting & Budget */}
        {step === 3 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Targeting & Budget</h2>
            <p className="mb-5 text-sm text-gray-500">Define your audience and set your budget.</p>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Target Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = selectedCategories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                          selected
                            ? 'border-offerup-green bg-offerup-green-light text-offerup-green'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        )}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Daily Budget: {formatCurrency(dailyBudget)}
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full accent-[#00AB80]"
                  />
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

        {/* Step 5: Review & Launch */}
        {step === 4 && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">Review & Launch</h2>
            <p className="mb-5 text-sm text-gray-500">Review your campaign before launching.</p>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Campaign Details</h3>
                <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {campaignName}</p>
                <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Objective:</span> {objective.charAt(0).toUpperCase() + objective.slice(1)}</p>
              </div>

              {selectedCreative && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-600">Creative</h3>
                  <div className="flex items-center gap-3">
                    <img src={selectedCreative.imageUrl} alt={selectedCreative.name} className="h-16 w-24 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{selectedCreative.name}</p>
                      <p className="text-xs text-gray-500">{selectedCreative.dimensions}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Placements</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlacements.map((p) => {
                    const info = AD_PLACEMENTS.find((ap) => ap.value === p);
                    return (
                      <span key={p} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-sm text-gray-700">
                        {info?.label || p}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-600">Targeting</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Categories:</span>{' '}
                  {selectedCategories.map((c) => CATEGORIES.find((cat) => cat.value === c)?.label || c).join(', ')}
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
