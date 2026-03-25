'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { SubscriptionTier } from '@/lib/types';
import { TIER_CONFIG } from '@/lib/constants';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') as SubscriptionTier | null;

  const signup = useAuthStore((s) => s.signup);
  const setSelectedTier = useSubscriptionStore((s) => s.setSelectedTier);

  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const success = signup(email, password, businessName);
    if (success) {
      if (tier && (tier === 'good' || tier === 'better' || tier === 'best')) {
        setSelectedTier(tier);
        router.push(`/checkout?tier=${tier}`);
      } else {
        router.push('/portal');
      }
    } else {
      setError('Could not create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-bold text-offerup-green">
            OfferUp
          </span>
          <span className="block text-sm text-gray-500 mt-1">
            for Business
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Create Account
        </h1>

        {tier && TIER_CONFIG[tier] && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center rounded-full bg-offerup-green-light px-3 py-1 text-sm font-medium text-offerup-green">
              {TIER_CONFIG[tier].displayName} Plan &mdash;{' '}
              {TIER_CONFIG[tier].priceLabel}
            </span>
          </div>
        )}

        {!tier && <div className="mb-6" />}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-offerup-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-offerup-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-offerup-green hover:text-offerup-green-dark transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <Suspense
        fallback={
          <div className="text-center text-gray-400">Loading...</div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
