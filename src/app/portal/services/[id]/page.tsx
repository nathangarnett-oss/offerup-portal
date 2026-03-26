'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Share2,
  Flag,
  Wrench,
  Megaphone,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import { useServicesStore } from '@/store/services-store';
import { SERVICE_CATEGORIES, SERVICE_PRICING_MODELS, EXPERIENCE_LEVELS } from '@/lib/constants';
import { formatCurrency, formatDateLong, cn } from '@/lib/utils';

function formatPricing(model: string, price: number): string {
  switch (model) {
    case 'hourly': return `${formatCurrency(price)}/hr`;
    case 'flat': return `${formatCurrency(price)} flat`;
    case 'starting_at': return `From ${formatCurrency(price)}`;
    case 'free_estimate': return 'Free Estimate';
    default: return formatCurrency(price);
  }
}

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
  paused: { label: 'Paused', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-600' },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { services, togglePromotion } = useServicesStore();

  const service = services.find((s) => s.id === params.id);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-gray-800">Service not found</h2>
        <p className="mt-2 text-sm text-gray-500">This service listing may have been removed.</p>
        <Link href="/portal/services" className="mt-4 text-sm font-medium text-offerup-green hover:text-offerup-green-dark">
          Back to My Services
        </Link>
      </div>
    );
  }

  const categoryLabel = SERVICE_CATEGORIES.find((c) => c.value === service.serviceCategory)?.label ?? service.serviceCategory;
  const pricingLabel = SERVICE_PRICING_MODELS.find((p) => p.value === service.pricingModel)?.label ?? service.pricingModel;
  const experienceLabel = EXPERIENCE_LEVELS.find((e) => e.value === service.experienceLevel)?.label ?? service.experienceLevel;
  const status = statusConfig[service.status] ?? statusConfig.active;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal/services')}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">Service Listing</h1>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', status.bg, status.text)}>
                {status.label}
              </span>
              {service.promoted && (
                <span className="rounded-full bg-offerup-green-light px-2.5 py-0.5 text-xs font-semibold text-offerup-green">
                  Promoted
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Preview of how this service appears on OfferUp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/portal/services/${service.id}/performance`}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <BarChart3 size={16} />
            Performance
          </Link>
          {service.promoted ? (
            <button
              onClick={() => togglePromotion(service.id)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Megaphone size={16} />
              Remove Promotion
            </button>
          ) : (
            <button
              onClick={() => togglePromotion(service.id)}
              className="flex items-center gap-1.5 rounded-lg border border-offerup-green px-4 py-2 text-sm font-medium text-offerup-green transition-colors hover:bg-offerup-green-light"
            >
              <Megaphone size={16} />
              Promote
            </button>
          )}
          <Link
            href={`/portal/services/create`}
            className="rounded-lg bg-offerup-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            Edit Listing
          </Link>
        </div>
      </div>

      {/* Service listing preview card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Green accent bar */}
        <div className="h-1.5 bg-offerup-green" />

        <div className="p-6 sm:p-8">
          {/* Top section: title, meta */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {categoryLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {pricingLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Star size={12} />
                  {experienceLabel}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-gray-400" />
                  {service.serviceArea.join(', ')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-gray-400" />
                  Posted {timeAgo(service.createdAt)}
                </span>
                {service.inquiryCount != null && service.inquiryCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users size={15} className="text-gray-400" />
                    {service.inquiryCount} inquir{service.inquiryCount !== 1 ? 'ies' : 'y'}
                  </span>
                )}
              </div>
            </div>

            {/* Price card */}
            <div className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center sm:min-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                <Wrench size={14} />
                {pricingLabel}
              </div>
              <div className="mt-1.5 text-xl font-bold text-gray-900">
                {formatPricing(service.pricingModel, service.price)}
              </div>
              <button className="mt-4 w-full rounded-lg bg-offerup-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark">
                Contact Now
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
                <Wrench size={18} className="text-offerup-green" />
                Service Description
              </h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{service.description}</div>
            </section>

            {/* Service Area */}
            {service.serviceArea && service.serviceArea.length > 0 && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <MapPin size={18} className="text-offerup-green" />
                  Service Area
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.serviceArea.map((location) => (
                    <li key={location} className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                      {location}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Availability */}
            {service.availability && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <Clock size={18} className="text-offerup-green" />
                  Availability
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{service.availability}</p>
              </section>
            )}
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* About the provider */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
              <CheckCircle2 size={18} className="text-offerup-green" />
              About the Provider
            </h3>
            <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-offerup-green text-lg font-bold text-white">
                {service.title.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{service.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{service.serviceArea[0]}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {experienceLabel} level provider. Find more services on OfferUp.
                </p>
                <button className="mt-2 flex items-center gap-1 text-sm font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">
                  View all services
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col items-center rounded-lg bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Interested in this service?</p>
            <button className="mt-3 rounded-lg bg-offerup-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark">
              Contact on OfferUp
            </button>
            <p className="mt-2 text-xs text-gray-400">
              Posted {formatDateLong(service.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
