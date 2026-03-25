'use client';

import { create } from 'zustand';
import { Job, JobType, JobCategory, PayType } from '@/lib/types';
import { mockJobs } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface JobsState {
  jobs: Job[];
  addJob: (data: {
    title: string;
    companyName: string;
    jobType: JobType;
    jobCategory: JobCategory;
    payType: PayType;
    payMin: number;
    payMax: number;
    location: string;
    remote: boolean;
    description: string;
    requirements: string;
  }) => void;
  togglePromotion: (id: string) => void;
  removeJob: (id: string) => void;
}

export const useJobsStore = create<JobsState>()((set) => ({
  jobs: mockJobs,
  addJob: (data) => {
    const newJob: Job = {
      id: `job-${generateId()}`,
      userId: 'user-001',
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      promoted: false,
    };
    set((state) => ({ jobs: [newJob, ...state.jobs] }));
  },
  togglePromotion: (id) => {
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              promoted: !j.promoted,
              promotionDate: !j.promoted ? new Date().toISOString() : undefined,
              promotionDays: !j.promoted ? 1 : undefined,
            }
          : j
      ),
    }));
  },
  removeJob: (id) => {
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
  },
}));
