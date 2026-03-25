'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobsStore } from '@/store/jobs-store';
import { JOB_TYPES, JOB_CATEGORIES, PAY_TYPES, LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { JobType, JobCategory, PayType } from '@/lib/types';

interface JobDraft {
  title: string;
  companyName: string;
  jobType: JobType | '';
  jobCategory: JobCategory | '';
  payType: PayType | '';
  payMin: string;
  payMax: string;
  location: string;
  remote: boolean;
  description: string;
  requirements: string;
}

const emptyDraft: JobDraft = {
  title: '',
  companyName: "Raidel's Electronics & More",
  jobType: '',
  jobCategory: '',
  payType: '',
  payMin: '',
  payMax: '',
  location: LOCATIONS[0],
  remote: false,
  description: '',
  requirements: '',
};

export default function CreateJobPage() {
  const router = useRouter();
  const { addJob } = useJobsStore();
  const [draft, setDraft] = useState<JobDraft>({ ...emptyDraft });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof JobDraft, value: string | boolean) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const isSalary = draft.payType === 'salary';

  const isValid =
    draft.title.trim() &&
    draft.companyName.trim() &&
    draft.jobType &&
    draft.jobCategory &&
    draft.payType &&
    Number(draft.payMin) > 0 &&
    Number(draft.payMax) >= Number(draft.payMin) &&
    draft.description.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    addJob({
      title: draft.title,
      companyName: draft.companyName,
      jobType: draft.jobType as JobType,
      jobCategory: draft.jobCategory as JobCategory,
      payType: draft.payType as PayType,
      payMin: Number(draft.payMin),
      payMax: Number(draft.payMax),
      location: draft.location,
      remote: draft.remote,
      description: draft.description,
      requirements: draft.requirements,
    });
    setSubmitted(true);
    setTimeout(() => router.push('/portal/jobs'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-offerup-green-light mb-4">
          <CheckCircle size={32} className="text-offerup-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Job Posted!</h2>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your jobs...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/portal/jobs')} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Post a Job</h1>
          <p className="text-sm text-gray-500">Find great candidates in your local area</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Job Title</label>
            <input type="text" value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Barista - Coffee Shop"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Company / Business Name</label>
            <input type="text" value={draft.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Your business name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Job Type</label>
            <select value={draft.jobType} onChange={(e) => update('jobType', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select type</option>
              {JOB_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Job Category</label>
            <select value={draft.jobCategory} onChange={(e) => update('jobCategory', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select category</option>
              {JOB_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Pay Type</label>
            <select value={draft.payType} onChange={(e) => update('payType', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              <option value="">Select pay type</option>
              {PAY_TYPES.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Pay Range {isSalary ? '(Annual)' : '(Hourly)'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" min={0} value={draft.payMin} onChange={(e) => update('payMin', e.target.value)} placeholder="Min"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
              </div>
              <span className="text-gray-400">–</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" min={0} value={draft.payMax} onChange={(e) => update('payMax', e.target.value)} placeholder="Max"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
            <select value={draft.location} onChange={(e) => update('location', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green">
              {LOCATIONS.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
            </select>
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.remote} onChange={(e) => update('remote', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-offerup-green focus:ring-offerup-green" />
              <span className="text-sm font-medium text-gray-700">This is a remote position</span>
            </label>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Job Description</label>
            <textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the role, responsibilities, and what a typical day looks like..." rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green resize-none" />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Requirements</label>
            <textarea value={draft.requirements} onChange={(e) => update('requirements', e.target.value)} placeholder="List qualifications, experience, certifications..." rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-offerup-green focus:ring-1 focus:ring-offerup-green resize-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/portal/jobs')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} disabled={!isValid} className={cn(
          'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
          isValid ? 'bg-offerup-green hover:bg-offerup-green-dark' : 'bg-gray-300 cursor-not-allowed'
        )}>Post Job</button>
      </div>
    </div>
  );
}
