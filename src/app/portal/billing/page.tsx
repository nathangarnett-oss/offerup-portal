'use client';

import { useState } from 'react';
import { mockBillingRecords, mockPaymentMethods } from '@/lib/mock-data';
import { formatCurrency, formatDateLong, cn } from '@/lib/utils';
import {
  CreditCard,
  Download,
  Filter,
  DollarSign,
  Receipt,
  TrendingDown,
  Plus,
} from 'lucide-react';

type BillingFilter = 'all' | 'subscription' | 'ad_spend';

export default function BillingPage() {
  const [filter, setFilter] = useState<BillingFilter>('all');

  const filteredRecords =
    filter === 'all'
      ? mockBillingRecords
      : filter === 'subscription'
      ? mockBillingRecords.filter((r) => !r.campaignId)
      : mockBillingRecords.filter((r) => !!r.campaignId);

  const totalSpent = mockBillingRecords.reduce((sum, r) => sum + r.amount, 0);
  const subscriptionTotal = mockBillingRecords
    .filter((r) => !r.campaignId)
    .reduce((sum, r) => sum + r.amount, 0);
  const adSpendTotal = mockBillingRecords
    .filter((r) => !!r.campaignId)
    .reduce((sum, r) => sum + r.amount, 0);

  const summaryCards = [
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Subscription', value: formatCurrency(subscriptionTotal), icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ad Spend', value: formatCurrency(adSpendTotal), icon: TrendingDown, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const filterTabs: { key: BillingFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'ad_spend', label: 'Ad Spend' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Billing & Invoices</h1>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={cn('rounded-lg p-2.5', card.bg)}>
                  <Icon size={20} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Payment Methods</h2>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Plus size={14} />
            Add Card
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {mockPaymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border-2 p-4',
                pm.isDefault ? 'border-offerup-green bg-offerup-green-light' : 'border-gray-200'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {pm.type} ****{pm.last4}
                </p>
                <p className="text-xs text-gray-500">Expires {pm.expiry}</p>
              </div>
              {pm.isDefault && (
                <span className="rounded-full bg-offerup-green px-2.5 py-0.5 text-xs font-medium text-white">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">Billing History</h2>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  filter === tab.key
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Description</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Type</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-700">{formatDateLong(record.date)}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{record.description}</td>
                <td className="px-6 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      record.campaignId
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {record.campaignId ? 'Ad Spend' : 'Subscription'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-800">
                  {formatCurrency(record.amount)}
                </td>
                <td className="px-6 py-3 text-center">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      record.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    )}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <button className="text-offerup-green hover:text-offerup-green-dark transition-colors">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
