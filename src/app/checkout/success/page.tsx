'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription-store';
import { TIER_CONFIG } from '@/lib/constants';

export default function CheckoutSuccessPage() {
  const subscription = useSubscriptionStore((s) => s.subscription);
  const tierName = subscription
    ? TIER_CONFIG[subscription.tier]?.displayName
    : 'Your';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md text-center">
        {/* Green Checkmark */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-offerup-green-light">
          <CheckCircle className="h-12 w-12 text-offerup-green" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome to OfferUp for Business!
        </h1>

        <p className="text-lg text-gray-500 mb-2">
          Your subscription is now active.
        </p>

        {subscription && (
          <div className="inline-flex items-center rounded-full bg-offerup-green-light px-4 py-1.5 text-sm font-medium text-offerup-green mb-8">
            {tierName} Plan &mdash;{' '}
            {TIER_CONFIG[subscription.tier]?.priceLabel}
          </div>
        )}

        {!subscription && <div className="mb-8" />}

        <div>
          <Link
            href="/portal"
            className="inline-flex items-center justify-center rounded-lg bg-offerup-green px-8 py-3 text-base font-semibold text-white hover:bg-offerup-green-dark transition-colors"
          >
            Go to Your Portal
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          You can manage your subscription and billing from your portal
          settings.
        </p>
      </div>
    </div>
  );
}
