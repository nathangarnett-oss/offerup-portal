'use client';

import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription-store';
import { TIER_CONFIG } from '@/lib/constants';
import { formatDateLong, cn } from '@/lib/utils';
import { mockPaymentMethods } from '@/lib/mock-data';

type SettingsTab = 'account' | 'subscription';

export default function SubscriptionPage() {
  const { subscription, cancelSubscription } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('subscription');

  const tierConfig = subscription ? TIER_CONFIG[subscription.tier] : null;

  const handleManageBilling = () => {
    alert('This would redirect to the Stripe Customer Portal for billing management.');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 text-2xl font-bold text-gray-800">Settings</h1>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('account')}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            activeTab === 'account'
              ? 'border-offerup-green text-offerup-green'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            activeTab === 'subscription'
              ? 'border-offerup-green text-offerup-green'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Subscription
        </button>
      </div>

      {activeTab === 'account' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Account Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Business Name</span>
              <span className="font-medium text-gray-800">Raidel&apos;s Electronics &amp; More</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800">raidel@electronicsandmore.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-800">(425)-906-3777</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          {subscription && tierConfig && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {tierConfig.name} Plan
                    </h2>
                    <span
                      className={cn(
                        'mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : subscription.status === 'canceled'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{tierConfig.priceLabel}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Plan Features</h3>
                <ul className="space-y-2">
                  {tierConfig.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="mt-0.5 shrink-0 text-offerup-green" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Renews on {formatDateLong(subscription.currentPeriodEnd)}
                  </span>
                  <div className="flex gap-3">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel your subscription?')) {
                            cancelSubscription();
                          }
                        }}
                        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                      >
                        Cancel plan
                      </button>
                    )}
                    <button
                      onClick={handleManageBilling}
                      className="rounded-md bg-offerup-green px-4 py-2 text-sm font-medium text-white hover:bg-offerup-green-dark transition-colors"
                    >
                      Manage Billing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mockPaymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                      <CreditCard size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {pm.type === 'visa' ? 'Visa' : 'Mastercard'} ending in {pm.last4}
                      </p>
                      <p className="text-xs text-gray-500">Expires {pm.expiry}</p>
                    </div>
                  </div>
                  {pm.isDefault && (
                    <span className="rounded-full bg-offerup-green-light px-2.5 py-0.5 text-xs font-medium text-offerup-green">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
