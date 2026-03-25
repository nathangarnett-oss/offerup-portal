'use client';

import { create } from 'zustand';
import { Service, ServiceCategory, ServicePricingModel, ExperienceLevel } from '@/lib/types';
import { mockServices } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface ServicesState {
  services: Service[];
  addService: (data: {
    title: string;
    description: string;
    serviceCategory: ServiceCategory;
    pricingModel: ServicePricingModel;
    price: number;
    serviceArea: string[];
    availability: string;
    experienceLevel: ExperienceLevel;
  }) => void;
  togglePromotion: (id: string) => void;
  removeService: (id: string) => void;
}

export const useServicesStore = create<ServicesState>()((set) => ({
  services: mockServices,
  addService: (data) => {
    const newService: Service = {
      id: `service-${generateId()}`,
      userId: 'user-001',
      title: data.title,
      description: data.description,
      serviceCategory: data.serviceCategory,
      pricingModel: data.pricingModel,
      price: data.price,
      serviceArea: data.serviceArea,
      availability: data.availability,
      experienceLevel: data.experienceLevel,
      imageUrl: `https://picsum.photos/seed/${generateId()}/400/300`,
      status: 'active',
      createdAt: new Date().toISOString(),
      promoted: false,
    };
    set((state) => ({ services: [newService, ...state.services] }));
  },
  togglePromotion: (id) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id
          ? {
              ...s,
              promoted: !s.promoted,
              promotionDate: !s.promoted ? new Date().toISOString() : undefined,
              promotionDays: !s.promoted ? 1 : undefined,
            }
          : s
      ),
    }));
  },
  removeService: (id) => {
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
  },
}));
