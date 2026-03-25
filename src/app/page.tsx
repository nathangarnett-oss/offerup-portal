'use client';

import Link from 'next/link';
import { Users, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Reach Millions of Buyers',
    description:
      'Get your products in front of a massive audience of local buyers actively looking to purchase.',
  },
  {
    icon: TrendingUp,
    title: 'Promote Your Listings',
    description:
      'Boost visibility of your listings with promoted placements that appear at the top of search results.',
  },
  {
    icon: BarChart3,
    title: 'Run Display Ad Campaigns',
    description:
      'Create targeted display ad campaigns with detailed analytics to maximize your return on ad spend.',
  },
];

const stats = [
  { value: '2M+', label: 'Active Buyers' },
  { value: '$1B+', label: 'Items Sold' },
  { value: '50K+', label: 'Business Sellers' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-6 py-24 sm:py-32 lg:py-40"
        style={{
          background: 'linear-gradient(135deg, #00AB80 0%, #008F6B 100%)',
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Grow Your Business on OfferUp
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl max-w-2xl mx-auto">
            Reach millions of local buyers with promoted listings and targeted
            ad campaigns. The easiest way to grow your sales on the largest
            local marketplace.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/pricing"
              className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-offerup-green shadow-sm hover:bg-gray-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-white px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              Everything You Need to Sell More
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful tools designed to help your business stand out and drive
              more sales on OfferUp.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-offerup-green-light">
                  <feature.icon className="h-6 w-6 text-offerup-green" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-offerup-green">
                  {stat.value}
                </div>
                <div className="mt-2 text-base text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join thousands of businesses already selling more on OfferUp.
            Choose a plan and start reaching local buyers today.
          </p>
          <div className="mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-offerup-green px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-offerup-green-dark transition-colors"
            >
              View Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} OfferUp for Business. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
