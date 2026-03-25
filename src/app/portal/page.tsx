'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Square, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  completed: boolean;
}

const initialChecklist: ChecklistItem[] = [
  {
    id: 'create-listings',
    title: 'Create some listings',
    description: 'Use the multi-listing editor to create multiple listings at once.',
    actionLabel: 'Create listings',
    actionHref: '/portal/listings',
    completed: false,
  },
  {
    id: 'download-app',
    title: 'Download the OfferUp app',
    description: 'Get the OfferUp app to manage your listings on the go and respond to buyers instantly.',
    actionLabel: 'Download app',
    actionHref: '#',
    completed: false,
  },
  {
    id: 'verify-business',
    title: 'Verify your business',
    description: 'Verify your business to earn a trusted badge and boost buyer confidence.',
    actionLabel: 'Get verified',
    actionHref: '#',
    completed: false,
  },
];

export default function PortalHomePage() {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [expandedId, setExpandedId] = useState<string>('create-listings');

  const completedCount = checklist.filter((item) => item.completed).length;

  const toggleComplete = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Home</h1>

      {/* Onboarding Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-base font-bold text-gray-800">
            {completedCount}/3 complete
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Complete the checklist below to start selling like a pro on OfferUp
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {checklist.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className="shrink-0 text-gray-400 hover:text-offerup-green transition-colors"
                    >
                      {item.completed ? (
                        <CheckSquare size={20} className="text-offerup-green" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        item.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 ml-8">
                    <p className="text-sm text-gray-500">{item.description}</p>
                    {item.actionLabel && item.actionHref && (
                      <Link
                        href={item.actionHref}
                        className="mt-3 inline-block rounded-md bg-offerup-green px-4 py-2 text-sm font-medium text-white hover:bg-offerup-green-dark transition-colors"
                      >
                        {item.actionLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
