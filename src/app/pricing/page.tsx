'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { TIER_CONFIG } from '@/lib/constants';
import { SubscriptionTier } from '@/lib/types';

const tiers: SubscriptionTier[] = ['good', 'better', 'best'];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-offerup-green">
              OfferUp
            </span>
            <span className="text-sm text-gray-500">for Business</span>
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-offerup-green hover:text-offerup-green-dark transition-colors"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Select the plan that fits your business needs. Upgrade or
              downgrade at any time.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {tiers.map((tier) => {
              const config = TIER_CONFIG[tier];
              const isHighlighted = config.highlighted;

              return (
                <div
                  key={tier}
                  className={`relative rounded-2xl bg-white p-8 flex flex-col ${
                    isHighlighted
                      ? 'border-2 border-offerup-green shadow-xl ring-1 ring-offerup-green/20'
                      : 'border border-gray-200 shadow-sm'
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-offerup-green px-4 py-1 text-sm font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {config.displayName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{config.name}</p>
                  </div>

                  <div className="mb-8">
                    {config.price > 0 ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-800">
                          ${config.price}
                        </span>
                        <span className="ml-1 text-base text-gray-500">
                          /mo
                        </span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-gray-800">
                        Custom
                      </div>
                    )}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {config.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-offerup-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={
                      tier === 'best'
                        ? 'mailto:sales@offerup.com'
                        : `/auth/signup?tier=${tier}`
                    }
                    className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                      isHighlighted
                        ? 'bg-offerup-green text-white hover:bg-offerup-green-dark'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {config.ctaLabel}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison */}
          <div className="mt-24 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
              Compare Plans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 pr-4 text-sm font-semibold text-gray-800">
                      Feature
                    </th>
                    {tiers.map((tier) => (
                      <th
                        key={tier}
                        className="py-4 px-4 text-sm font-semibold text-gray-800 text-center"
                      >
                        {TIER_CONFIG[tier].displayName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Active Listings
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      35
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      100
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Promoted Listings/mo
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      4
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      20
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Display Ad Campaigns
                    </td>
                    <td className="py-4 px-4 text-center text-gray-300">
                      &mdash;
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-offerup-green mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-offerup-green mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Analytics Dashboard
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Basic
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Full
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Custom
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Dedicated Account Manager
                    </td>
                    <td className="py-4 px-4 text-center text-gray-300">
                      &mdash;
                    </td>
                    <td className="py-4 px-4 text-center text-gray-300">
                      &mdash;
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-offerup-green mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-sm text-gray-600">
                      Support
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Email
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Priority
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 text-center">
                      Dedicated
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
