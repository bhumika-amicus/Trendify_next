import Link from 'next/link';
import type { OrderFilterStatus } from '@/types';

interface OrderFilterTabsProps {
  activeStatus?: string;
}

interface FilterTabItem {
  label: string;
  value: OrderFilterStatus;
  href: string;
}

const TABS: FilterTabItem[] = [
  { label: 'All Orders', value: 'all', href: '/orders' },
  { label: 'Processing', value: 'processing', href: '/orders?status=processing' },
  { label: 'Shipped', value: 'shipped', href: '/orders?status=shipped' },
  { label: 'Delivered', value: 'delivered', href: '/orders?status=delivered' },
  { label: 'Cancelled', value: 'cancelled', href: '/orders?status=cancelled' },
];

export default function OrderFilterTabs({ activeStatus }: OrderFilterTabsProps) {
  const normalized = (activeStatus || 'all').toLowerCase().trim();
  const resolvedActive = TABS.find((tab) => tab.value === normalized)?.value ?? 'all';

  return (
    <div className="w-full border-b border-gray-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
      <nav className="flex items-center gap-2 sm:gap-3 min-w-max" aria-label="Order status filter tabs">
        {TABS.map((tab) => {
          const isActive = resolvedActive === tab.value;

          return (
            <Link
              key={tab.value}
              href={tab.href}
              scroll={false}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-brand-orange text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
