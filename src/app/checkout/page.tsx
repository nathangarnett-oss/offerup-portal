'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscriptionStore } from '@/store/subscription-store';
import { TIER_CONFIG } from '@/lib/constants';
import { SubscriptionTier } from '@/lib/types';
import { Lock } from 'lucide-react';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') as SubscriptionTier | null;
  const selectedTier = useSubscriptionStore((s) => s.selectedTier);
  const subscribe = useSubscriptionStore((s) => s.subscribe);

  const tier = tierParam || selectedTier || 'good';
  const config = TIER_CONFIG[tier];

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    if (!cardNumber || !expiry || !cvc) {
      setError('Please fill in all payment fields.');
      return;
    }

    setLoading(true);
    subscribe(tier);
    router.push('/checkout/success');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-baseline gap-1">
          <span className="text-xl font-bold text-offerup-green">
            OfferUp
          </span>
          <span className="text-sm text-gray-500">for Business</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {config.displayName} Plan
                  </p>
                  <p className="text-sm text-gray-500">{config.name} tier</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {config.priceLabel}
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {config.features.slice(0, 5).map((feature) => (
                <li
                  key={feature}
                  className="text-sm text-gray-600 flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-offerup-green shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">Total</p>
                <p className="text-xl font-bold text-gray-800">
                  {config.price > 0 ? `$${config.price}/mo` : 'Custom'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Details
              </h2>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Expiration
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-offerup-green focus:ring-1 focus:ring-offerup-green outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-offerup-green focus:ring-offerup-green"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <span className="text-offerup-green font-medium">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-offerup-green font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-offerup-green px-4 py-3 text-sm font-semibold text-white hover:bg-offerup-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>

              <p className="text-center text-xs text-gray-400">
                This is a mock checkout. No real charges will be made.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <Suspense
        fallback={
          <div className="text-center text-gray-400 py-20">Loading...</div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
