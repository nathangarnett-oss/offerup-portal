'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, SubscriptionTier } from '@/lib/types';
import { mockSubscription } from '@/lib/mock-data';
import { TIER_CONFIG } from '@/lib/constants';

interface SubscriptionState {
  subscription: Subscription | null;
  selectedTier: SubscriptionTier | null;
  setSelectedTier: (tier: SubscriptionTier) => void;
  subscribe: (tier: SubscriptionTier) => void;
  cancelSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscription: mockSubscription,
      selectedTier: null,
      setSelectedTier: (tier) => set({ selectedTier: tier }),
      subscribe: (tier) => {
        const config = TIER_CONFIG[tier];
        set({
          subscription: {
            ...mockSubscription,
            tier,
            status: 'active',
            maxListings: config.maxListings,
            maxPromotions: config.maxPromotions,
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          selectedTier: null,
        });
      },
      cancelSubscription: () => {
        set((state) => ({
          subscription: state.subscription ? { ...state.subscription, status: 'canceled' } : null,
        }));
      },
    }),
    { name: 'offerup-subscription' }
  )
);
