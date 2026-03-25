'use client';

import { create } from 'zustand';
import { Campaign, AdCreative, CampaignType, CampaignStatus, AdPlacement, ListingCategory } from '@/lib/types';
import { mockCampaigns, mockCreatives } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface CampaignsState {
  campaigns: Campaign[];
  creatives: AdCreative[];
  createCampaign: (data: {
    name: string;
    type: CampaignType;
    dailyBudget: number;
    totalBudget: number;
    startDate: string;
    endDate: string;
    targetCategories: ListingCategory[];
    targetLocations: string[];
    placements: AdPlacement[];
    listingIds?: string[];
    creativeIds?: string[];
  }) => Campaign;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;
  resumeCampaign: (id: string) => void;
  endCampaign: (id: string) => void;
  addCreative: (data: { name: string; dimensions: string; type: AdCreative['type'] }) => void;
  deleteCreative: (id: string) => void;
}

export const useCampaignsStore = create<CampaignsState>()((set, get) => ({
  campaigns: mockCampaigns,
  creatives: mockCreatives,
  createCampaign: (data) => {
    const newCampaign: Campaign = {
      id: `camp-${generateId()}`,
      userId: 'user-001',
      name: data.name,
      type: data.type,
      status: 'active' as CampaignStatus,
      dailyBudget: data.dailyBudget,
      totalBudget: data.totalBudget,
      totalSpent: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      targetCategories: data.targetCategories,
      targetLocations: data.targetLocations,
      placements: data.placements,
      listingIds: data.listingIds,
      creativeIds: data.creativeIds,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }));
    return newCampaign;
  },
  updateCampaign: (id, data) => {
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },
  deleteCampaign: (id) => {
    set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) }));
  },
  pauseCampaign: (id) => {
    get().updateCampaign(id, { status: 'paused' });
  },
  resumeCampaign: (id) => {
    get().updateCampaign(id, { status: 'active' });
  },
  endCampaign: (id) => {
    get().updateCampaign(id, { status: 'ended' });
  },
  addCreative: (data) => {
    const newCreative: AdCreative = {
      id: `creative-${generateId()}`,
      userId: 'user-001',
      name: data.name,
      imageUrl: `https://picsum.photos/seed/${generateId()}/${data.dimensions.replace('x', '/')}`,
      dimensions: data.dimensions,
      type: data.type,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ creatives: [newCreative, ...state.creatives] }));
  },
  deleteCreative: (id) => {
    set((state) => ({ creatives: state.creatives.filter((c) => c.id !== id) }));
  },
}));
