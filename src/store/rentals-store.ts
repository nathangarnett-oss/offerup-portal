'use client';

import { create } from 'zustand';
import { Rental, PropertyType, PetPolicy, LeaseTerm } from '@/lib/types';
import { mockRentals } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface RentalsState {
  rentals: Rental[];
  addRental: (data: {
    title: string;
    description: string;
    propertyType: PropertyType;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    petPolicy: PetPolicy;
    availableDate: string;
    leaseTerm: LeaseTerm;
    amenities: string[];
    location: string;
  }) => void;
  togglePromotion: (id: string) => void;
  removeRental: (id: string) => void;
}

export const useRentalsStore = create<RentalsState>()((set) => ({
  rentals: mockRentals,
  addRental: (data) => {
    const newRental: Rental = {
      id: `rental-${generateId()}`,
      userId: 'user-001',
      ...data,
      imageUrl: `https://picsum.photos/seed/${generateId()}/400/300`,
      status: 'active',
      createdAt: new Date().toISOString(),
      promoted: false,
    };
    set((state) => ({ rentals: [newRental, ...state.rentals] }));
  },
  togglePromotion: (id) => {
    set((state) => ({
      rentals: state.rentals.map((r) =>
        r.id === id
          ? {
              ...r,
              promoted: !r.promoted,
              promotionDate: !r.promoted ? new Date().toISOString() : undefined,
              promotionDays: !r.promoted ? 1 : undefined,
            }
          : r
      ),
    }));
  },
  removeRental: (id) => {
    set((state) => ({ rentals: state.rentals.filter((r) => r.id !== id) }));
  },
}));
