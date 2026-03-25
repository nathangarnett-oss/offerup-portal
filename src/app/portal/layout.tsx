'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusSquare,
  List,
  Megaphone,
  BarChart3,
  CreditCard,
  Share2,
  Settings,
  CircleHelp,
  Bell,
  Wrench,
  Briefcase,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = { label: string; icon: typeof Home; href: string; disabled?: boolean } | { separator: true; label: string };

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/portal' },
  { label: 'Create listings', icon: PlusSquare, href: '/portal/listings/create' },
  { label: 'My listings', icon: List, href: '/portal/listings' },
  { separator: true, label: 'Services' },
  { label: 'Create service', icon: Wrench, href: '/portal/services/create' },
  { label: 'My services', icon: Wrench, href: '/portal/services' },
  { separator: true, label: 'Jobs' },
  { label: 'Post a job', icon: Briefcase, href: '/portal/jobs/create' },
  { label: 'My jobs', icon: Briefcase, href: '/portal/jobs' },
  { separator: true, label: 'Rentals' },
  { label: 'List a rental', icon: Building2, href: '/portal/rentals/create' },
  { label: 'My rentals', icon: Building2, href: '/portal/rentals' },
  { separator: true, label: 'Advertising' },
  { label: 'Promotions', icon: Megaphone, href: '/portal/ads' },
  { label: 'Ads Manager', icon: BarChart3, href: '/portal/ads' },
  { label: 'Billing', icon: CreditCard, href: '/portal/billing' },
  { label: 'Refer & earn', icon: Share2, href: '#', disabled: true },
];

function isActive(pathname: string, href: string, label: string): boolean {
  if (href === '#') return false;
  if (href === '/portal') return pathname === '/portal';
  if (label === 'Promotions' || label === 'Ads Manager') return pathname.startsWith('/portal/ads');
  if (label === 'Billing') return pathname.startsWith('/portal/billing');
  // Exact match for "create" routes to avoid matching the list page
  if (label === 'Create listings') return pathname === '/portal/listings/create';
  if (label === 'My listings') return pathname === '/portal/listings';
  if (label === 'Create service') return pathname === '/portal/services/create';
  if (label === 'My services') return pathname === '/portal/services';
  if (label === 'Post a job') return pathname === '/portal/jobs/create';
  if (label === 'My jobs') return pathname === '/portal/jobs';
  if (label === 'List a rental') return pathname === '/portal/rentals/create';
  if (label === 'My rentals') return pathname === '/portal/rentals';
  return pathname.startsWith(href);
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
        <Link href="/portal" className="flex items-center gap-1">
          <span className="text-lg font-bold text-offerup-green">OfferUp</span>
          <span className="text-sm text-gray-600">for Business</span>
        </Link>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <CircleHelp size={20} />
          </button>
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-offerup-green text-xs font-semibold text-white">
            RE
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="flex w-[170px] shrink-0 flex-col justify-between border-r border-gray-200 bg-white">
          <nav className="flex flex-col py-2 overflow-y-auto">
            {navItems.map((item, idx) => {
              if ('separator' in item) {
                return (
                  <div key={`sep-${item.label}`} className="mt-2 mb-1 px-4">
                    <div className="border-t border-gray-100" />
                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {item.label}
                    </span>
                  </div>
                );
              }

              const active = isActive(pathname, item.href, item.label);
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="flex items-center gap-2.5 border-l-[3px] border-transparent px-4 py-2 text-[13px] text-gray-400 cursor-not-allowed"
                  >
                    <Icon size={16} />
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={`${item.label}-${idx}`}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] font-medium transition-colors',
                    active
                      ? 'border-offerup-green bg-offerup-green-light text-offerup-green'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon size={16} className={active ? 'text-offerup-green' : 'text-gray-500'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Settings */}
          <div className="border-t border-gray-200">
            <Link
              href="/portal/subscription"
              className={cn(
                'flex items-center gap-2.5 border-l-[3px] px-4 py-3 text-[13px] font-medium transition-colors',
                pathname.startsWith('/portal/subscription')
                  ? 'border-offerup-green bg-offerup-green-light text-offerup-green'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Settings
                size={18}
                className={pathname.startsWith('/portal/subscription') ? 'text-offerup-green' : 'text-gray-500'}
              />
              Settings
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
