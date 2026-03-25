'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { mockUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, businessName: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        const user = { ...mockUser, email };
        set({ user, isAuthenticated: true });
        return true;
      },
      signup: (email: string, _password: string, businessName: string) => {
        const user = { ...mockUser, email, businessName, id: 'user-' + Date.now() };
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'offerup-auth' }
  )
);
