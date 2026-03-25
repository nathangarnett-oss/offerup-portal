'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServicesStore } from '@/store/services-store';
import { SERVICE_CATEGORIES, SERVICE_PRICING_MODELS, EXPERIENCE_LEVELS, LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import type { ServiceCategory, ServicePricingModel, ExperienceLevel } from '@/lib/types';

interface ServiceDraft {
  title: string;
  description: string;
  serviceCategory: ServiceCategory | '';
  pricingModel: ServicePricingModel | '';
  price: string;
  serviceArea: string[];
  availability: string;
  experienceLevel: ExperienceLevel | '';
}

const emptyDraft: ServiceDraft = {
  title: '',
  description: '',
  serviceCategory: '',
  pricingModel: '',
  price: '',
  serviceArea: [LOCATIONS[0]],
  availability: '',
  experienceLevel: '',
};

export default function CreateServicePage() {
  const router = useRouter();
  const { addService } = useServicesStore();
  const [draft, setDraft] = useState<ServiceDraft>({ ...emptyDraft });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof ServiceDraft, value: string | string[]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArea = (loc: string) => {
    setDraft((prev) => ({
      ...prev,
      serviceArea: prev.serviceArea.includes(loc)
        ? prev.serviceArea.filter((a) => a !== loc)
        : [...prev.serviceArea, loc],
    }));
  };

  const isFreeEstimate = draft.pricingModel === 'free_estimate';

  const isValid =
    draft.title.trim() &&
    draft.description.trim() &&
    draft.serviceCategory &&
    draft.pricingModel &&
    (isFreeEstimate || Number(draft.price) > 0) &&
    draft.serviceArea.length > 0 &&
    draft.experienceLevel;

  const handleSubmit = () => {
    if (!isValid) return;
    addService({
      title: draft.title,
      description: draft.description,
      serviceCategory: draft.serviceCategory as ServiceCategory,
      pricingModel: draft.pricingModel as ServicePricingModel,
      price: isFreeEstimate ? 0 : Number(draft.price),
      serviceArea: draft.serviceArea,
      availability: draft.availability,
      experienceLevel: draft.experienceLevel as ExperienceLevel,
    });
    setSubmitted(true);
    setTimeout(() => router.push('/portal/services'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-offerup-green-light mb-4">
          <CheckCircle size={32} className="text-offerup-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Service Created!</h2>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your services...</p>
      </div>
    );
  }

  const priceLabel =
    draft.pricingModel === 'hourly' ? 'Hourly Rate' :
    draft.pricingModel === 'flat' ? 'Flat Rate' :
    draft.pricingModel === 'starting_at' ? 'Starting Price' : 'Price';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/portal/services')} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Service</h1>
          <p className="text-sm text-gray-500">List a service you offer to local customers</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">Service Title</label>
            <input type="text" value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Deep House Cleaning" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your service in detail..." rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green resize-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Service Category</label>
            <select value={draft.serviceCategory} onChange={(e) => update('serviceCategory', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select category</option>
              {SERVICE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Experience Level</label>
            <select value={draft.experienceLevel} onChange={(e) => update('experienceLevel', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select level</option>
              {EXPERIENCE_LEVELS.map((l) => (<option key={l.value} value={l.value}>{l.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Pricing Model</label>
            <select value={draft.pricingModel} onChange={(e) => update('pricingModel', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select pricing</option>
              {SERVICE_PRICING_MODELS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>

          {!isFreeEstimate && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{priceLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" min={0} value={draft.price} onChange={(e) => update('price', e.target.value)} placeholder="0" className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-4 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
              </div>
            </div>
          )}

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Service Area</label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button key={loc} type="button" onClick={() => toggleArea(loc)} className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  draft.serviceArea.includes(loc) ? 'bg-offerup-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}>{loc}</button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Availability</label>
            <input type="text" value={draft.availability} onChange={(e) => update('availability', e.target.value)} placeholder="e.g. Mon-Fri 8am-6pm" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/portal/services')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} disabled={!isValid} className={cn(
          'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
          isValid ? 'bg-offerup-green hover:bg-offerup-green-dark' : 'bg-gray-300 cursor-not-allowed'
        )}>Create Service</button>
      </div>
    </div>
  );
}
