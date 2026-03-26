'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Home,
  Bath,
  Maximize2,
  PawPrint,
  Clock,
  CheckCircle2,
  Share2,
  Flag,
  Building2,
  Megaphone,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import { useRentalsStore } from '@/store/rentals-store';
import { PROPERTY_TYPES, PET_POLICIES, LEASE_TERMS } from '@/lib/constants';
import { formatCurrency, formatDateLong, cn } from '@/lib/utils';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const posted = new Date(dateStr);
  const diffMs = now.getTime() - posted.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  return `${Math.floor(days / 30)} months ago`;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-700' },
  rented: { label: 'Rented', bg: 'bg-gray-100', text: 'text-gray-600' },
  draft: { label: 'Draft', bg: 'bg-yellow-50', text: 'text-yellow-700' },
};

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { rentals, togglePromotion } = useRentalsStore();

  const rental = rentals.find((r) => r.id === params.id);

  if (!rental) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-gray-800">Rental not found</h2>
        <p className="mt-2 text-sm text-gray-500">This rental listing may have been removed.</p>
        <Link href="/portal/rentals" className="mt-4 text-sm font-medium text-offerup-green hover:text-offerup-green-dark">
          Back to My Rentals
        </Link>
      </div>
    );
  }

  const propertyTypeLabel = PROPERTY_TYPES.find((t) => t.value === rental.propertyType)?.label ?? rental.propertyType;
  const petPolicyLabel = PET_POLICIES.find((p) => p.value === rental.petPolicy)?.label ?? rental.petPolicy;
  const leaseTermLabel = LEASE_TERMS.find((l) => l.value === rental.leaseTerm)?.label ?? rental.leaseTerm;
  const status = statusConfig[rental.status] ?? statusConfig.active;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal/rentals')}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">Rental Listing</h1>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', status.bg, status.text)}>
                {status.label}
              </span>
              {rental.promoted && (
                <span className="rounded-full bg-offerup-green-light px-2.5 py-0.5 text-xs font-semibold text-offerup-green">
                  Promoted
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Preview of how this rental appears on OfferUp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/portal/rentals/${rental.id}/performance`}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <BarChart3 size={16} />
            Performance
          </Link>
          {rental.promoted ? (
            <button
              onClick={() => togglePromotion(rental.id)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Megaphone size={16} />
              Remove Promotion
            </button>
          ) : (
            <button
              onClick={() => togglePromotion(rental.id)}
              className="flex items-center gap-1.5 rounded-lg border border-offerup-green px-4 py-2 text-sm font-medium text-offerup-green transition-colors hover:bg-offerup-green-light"
            >
              <Megaphone size={16} />
              Promote
            </button>
          )}
          <Link
            href={`/portal/rentals/create`}
            className="rounded-lg bg-offerup-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            Edit Listing
          </Link>
        </div>
      </div>

      {/* Rental listing preview card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Green accent bar */}
        <div className="h-1.5 bg-offerup-green" />

        <div className="p-6 sm:p-8">
          {/* Top section: title, meta, pay card */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {propertyTypeLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {petPolicyLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {leaseTermLabel}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">{rental.title}</h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-gray-400" />
                  {rental.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-gray-400" />
                  Available {formatDateLong(rental.availableDate)}
                </span>
                {rental.inquiryCount != null && rental.inquiryCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} className="text-gray-400" />
                    {rental.inquiryCount} inquir{rental.inquiryCount !== 1 ? 'ies' : 'y'}
                  </span>
                )}
              </div>
            </div>

            {/* Pay card */}
            <div className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center sm:min-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Monthly Rent
              </div>
              <div className="mt-1.5 text-xl font-bold text-gray-900">
                {formatCurrency(rental.rent)}/mo
              </div>
              <button className="mt-4 w-full rounded-lg bg-offerup-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark">
                Apply Now
              </button>
              <div className="mt-2 flex items-center justify-center gap-3">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Share2 size={13} />
                  Share
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Flag size={13} />
                  Report
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Description */}
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                <Building2 size={18} className="text-offerup-green" />
                Description
              </h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{rental.description}</div>
            </section>

            {/* Property Details */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                <CheckCircle2 size={18} className="text-offerup-green" />
                Property Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <Home size={20} className="text-offerup-green" />
                  <div>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="text-sm font-semibold text-gray-800">{rental.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <Bath size={20} className="text-offerup-green" />
                  <div>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="text-sm font-semibold text-gray-800">{rental.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <Maximize2 size={20} className="text-offerup-green" />
                  <div>
                    <p className="text-xs text-gray-500">Square Feet</p>
                    <p className="text-sm font-semibold text-gray-800">{rental.sqft.toLocaleString()} sqft</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities */}
            {rental.amenities && rental.amenities.length > 0 && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <PawPrint size={18} className="text-offerup-green" />
                  Amenities
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {rental.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-offerup-green" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* About the landlord */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
              <Building2 size={18} className="text-offerup-green" />
              About the Landlord
            </h3>
            <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-offerup-green text-lg font-bold text-white">
                {rental.title.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{rental.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{rental.location}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Find more rentals from this landlord on OfferUp.
                </p>
                <button className="mt-2 flex items-center gap-1 text-sm font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">
                  View all rentals
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col items-center rounded-lg bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Interested in this rental?</p>
            <button className="mt-3 rounded-lg bg-offerup-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark">
              Inquire on OfferUp
            </button>
            <p className="mt-2 text-xs text-gray-400">
              Posted {formatDateLong(rental.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
