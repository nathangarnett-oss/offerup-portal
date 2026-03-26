'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Globe2,
  Calendar,
  Users,
  CheckCircle2,
  Share2,
  Flag,
  Building2,
  Megaphone,
  ExternalLink,
} from 'lucide-react';
import { useJobsStore } from '@/store/jobs-store';
import { JOB_TYPES, JOB_CATEGORIES, PAY_TYPES } from '@/lib/constants';
import { formatDateLong, cn } from '@/lib/utils';

function formatPay(payType: string, payMin: number, payMax: number): string {
  if (payType === 'salary') {
    return `$${(payMin / 1000).toFixed(0)}K - $${(payMax / 1000).toFixed(0)}K / year`;
  }
  return `$${payMin} - $${payMax} / hour`;
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
  closed: { label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-600' },
  draft: { label: 'Draft', bg: 'bg-yellow-50', text: 'text-yellow-700' },
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, togglePromotion } = useJobsStore();

  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-gray-800">Job not found</h2>
        <p className="mt-2 text-sm text-gray-500">This job listing may have been removed.</p>
        <Link href="/portal/jobs" className="mt-4 text-sm font-medium text-offerup-green hover:text-offerup-green-dark">
          Back to My Jobs
        </Link>
      </div>
    );
  }

  const typeLabel = JOB_TYPES.find((t) => t.value === job.jobType)?.label ?? job.jobType;
  const categoryLabel = JOB_CATEGORIES.find((c) => c.value === job.jobCategory)?.label ?? job.jobCategory;
  const payTypeLabel = PAY_TYPES.find((p) => p.value === job.payType)?.label ?? job.payType;
  const status = statusConfig[job.status] ?? statusConfig.active;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal/jobs')}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">Job Listing</h1>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', status.bg, status.text)}>
                {status.label}
              </span>
              {job.promoted && (
                <span className="rounded-full bg-offerup-green-light px-2.5 py-0.5 text-xs font-semibold text-offerup-green">
                  Promoted
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Preview of how this job appears on OfferUp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {job.promoted ? (
            <button
              onClick={() => togglePromotion(job.id)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Megaphone size={16} />
              Remove Promotion
            </button>
          ) : (
            <button
              onClick={() => togglePromotion(job.id)}
              className="flex items-center gap-1.5 rounded-lg border border-offerup-green px-4 py-2 text-sm font-medium text-offerup-green transition-colors hover:bg-offerup-green-light"
            >
              <Megaphone size={16} />
              Promote
            </button>
          )}
          <Link
            href={`/portal/jobs/create`}
            className="rounded-lg bg-offerup-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark"
          >
            Edit Listing
          </Link>
        </div>
      </div>

      {/* Job listing preview card — styled like OfferUp public listing */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Green accent bar */}
        <div className="h-1.5 bg-offerup-green" />

        <div className="p-6 sm:p-8">
          {/* Top section: title, company, meta */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {typeLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {categoryLabel}
                </span>
                {job.remote && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Globe2 size={12} />
                    Remote
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-offerup-green text-xs font-bold text-white">
                  {job.companyName.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{job.companyName}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-gray-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-gray-400" />
                  Posted {timeAgo(job.createdAt)}
                </span>
                {job.applicationCount != null && job.applicationCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users size={15} className="text-gray-400" />
                    {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Pay card */}
            <div className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center sm:min-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                <DollarSign size={14} />
                {payTypeLabel} Pay
              </div>
              <div className="mt-1.5 text-xl font-bold text-gray-900">
                {formatPay(job.payType, job.payMin, job.payMax)}
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
                <Briefcase size={18} className="text-offerup-green" />
                Job Description
              </h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{job.description}</div>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <CheckCircle2 size={18} className="text-offerup-green" />
                  Requirements
                </h3>
                <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{job.requirements}</div>
              </section>
            )}

            {/* Schedule */}
            {job.schedule && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <Clock size={18} className="text-offerup-green" />
                  Schedule
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{job.schedule}</p>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <CheckCircle2 size={18} className="text-offerup-green" />
                  Benefits & Perks
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {job.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-offerup-green" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* About the company */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
              <Building2 size={18} className="text-offerup-green" />
              About {job.companyName}
            </h3>
            <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-offerup-green text-lg font-bold text-white">
                {job.companyName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{job.companyName}</p>
                <p className="mt-0.5 text-sm text-gray-500">{job.location}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Find more jobs from this employer on OfferUp.
                </p>
                <button className="mt-2 flex items-center gap-1 text-sm font-medium text-offerup-green hover:text-offerup-green-dark transition-colors">
                  View all jobs
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col items-center rounded-lg bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Interested in this position?</p>
            <button className="mt-3 rounded-lg bg-offerup-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-offerup-green-dark">
              Apply Now on OfferUp
            </button>
            <p className="mt-2 text-xs text-gray-400">
              Posted {formatDateLong(job.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
