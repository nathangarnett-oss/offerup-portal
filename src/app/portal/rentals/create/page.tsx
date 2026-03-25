'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRentalsStore } from '@/store/rentals-store';
import { PROPERTY_TYPES, PET_POLICIES, LEASE_TERMS, AMENITIES, LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import type { PropertyType, PetPolicy, LeaseTerm } from '@/lib/types';

interface RentalDraft {
  title: string;
  description: string;
  propertyType: PropertyType | '';
  rent: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  petPolicy: PetPolicy | '';
  availableDate: string;
  leaseTerm: LeaseTerm | '';
  amenities: string[];
  location: string;
}

const emptyDraft: RentalDraft = {
  title: '',
  description: '',
  propertyType: '',
  rent: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  petPolicy: '',
  availableDate: '',
  leaseTerm: '',
  amenities: [],
  location: LOCATIONS[0],
};

export default function CreateRentalPage() {
  const router = useRouter();
  const { addRental } = useRentalsStore();
  const [draft, setDraft] = useState<RentalDraft>({ ...emptyDraft });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof RentalDraft, value: string | string[]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setDraft((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const isValid =
    draft.title.trim() &&
    draft.description.trim() &&
    draft.propertyType &&
    Number(draft.rent) > 0 &&
    draft.bedrooms !== '' &&
    draft.bathrooms !== '' &&
    draft.petPolicy &&
    draft.availableDate &&
    draft.leaseTerm;

  const handleSubmit = () => {
    if (!isValid) return;
    addRental({
      title: draft.title,
      description: draft.description,
      propertyType: draft.propertyType as PropertyType,
      rent: Number(draft.rent),
      bedrooms: Number(draft.bedrooms),
      bathrooms: Number(draft.bathrooms),
      sqft: Number(draft.sqft) || 0,
      petPolicy: draft.petPolicy as PetPolicy,
      availableDate: draft.availableDate,
      leaseTerm: draft.leaseTerm as LeaseTerm,
      amenities: draft.amenities,
      location: draft.location,
    });
    setSubmitted(true);
    setTimeout(() => router.push('/portal/rentals'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-offerup-green-light mb-4">
          <CheckCircle size={32} className="text-offerup-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Rental Listed!</h2>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your rentals...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/portal/rentals')} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">List a Rental</h1>
          <p className="text-sm text-gray-500">Post your rental property to reach local renters</p>
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">Listing Title</label>
            <input type="text" value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Spacious 2BR Capitol Hill Apt"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the property, neighborhood, and key features..." rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green resize-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Property Type</label>
            <select value={draft.propertyType} onChange={(e) => update('propertyType', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Monthly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" min={0} value={draft.rent} onChange={(e) => update('rent', e.target.value)} placeholder="0"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-12 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/mo</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Bedrooms</label>
            <input type="number" min={0} value={draft.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} placeholder="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Bathrooms</label>
            <input type="number" min={0} step={0.5} value={draft.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} placeholder="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Square Footage</label>
            <input type="number" min={0} value={draft.sqft} onChange={(e) => update('sqft', e.target.value)} placeholder="e.g. 950"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Pet Policy</label>
            <select value={draft.petPolicy} onChange={(e) => update('petPolicy', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select policy</option>
              {PET_POLICIES.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Available Date</label>
            <input type="date" value={draft.availableDate} onChange={(e) => update('availableDate', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Lease Term</label>
            <select value={draft.leaseTerm} onChange={(e) => update('leaseTerm', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select term</option>
              {LEASE_TERMS.map((l) => (<option key={l.value} value={l.value}>{l.label}</option>))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 rounded border-gray-300 text-offerup-green focus:ring-offerup-green" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
            <select value={draft.location} onChange={(e) => update('location', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              {LOCATIONS.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/portal/rentals')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} disabled={!isValid} className={cn(
          'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
          isValid ? 'bg-offerup-green hover:bg-offerup-green-dark' : 'bg-gray-300 cursor-not-allowed'
        )}>List Rental</button>
      </div>
    </div>
  );
}
