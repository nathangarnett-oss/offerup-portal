'use client';

import { create } from 'zustand';
import { Listing, ListingCategory } from '@/lib/types';
import { mockListings } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface ListingsState {
  listings: Listing[];
  addListing: (data: { title: string; description: string; price: number; category: ListingCategory; location: string }) => void;
  togglePromotion: (id: string) => void;
  removeListing: (id: string) => void;
}

export const useListingsStore = create<ListingsState>()((set) => ({
  listings: mockListings,
  addListing: (data) => {
    const newListing: Listing = {
      id: `listing-${generateId()}`,
      userId: 'user-001',
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: `https://picsum.photos/seed/${generateId()}/400/300`,
      status: 'active',
      createdAt: new Date().toISOString(),
      postDate: new Date().toISOString(),
      location: data.location,
      promoted: false,
    };
    set((state) => ({ listings: [newListing, ...state.listings] }));
  },
  togglePromotion: (id) => {
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === id
          ? {
              ...l,
              promoted: !l.promoted,
              promotionDate: !l.promoted ? new Date().toISOString() : undefined,
              promotionDays: !l.promoted ? 1 : undefined,
            }
          : l
      ),
    }));
  },
  removeListing: (id) => {
    set((state) => ({ listings: state.listings.filter((l) => l.id !== id) }));
  },
}));
