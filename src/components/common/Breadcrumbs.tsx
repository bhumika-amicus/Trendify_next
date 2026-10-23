'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  variant?: 'default' | 'on-dark' | 'dark';
}

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Home' }],
  '/products': [{ label: 'Home', path: '/' }, { label: 'Products' }],
  '/about': [{ label: 'Home', path: '/' }, { label: 'About Trendify' }],
  '/cart': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart' }],
  '/checkout': [
    { label: 'Home', path: '/' },
    { label: 'Shopping Cart', path: '/cart' },
    { label: 'Checkout' },
  ],
  '/orders': [{ label: 'Home', path: '/' }, { label: 'My Orders' }],
  '/login': [{ label: 'Home', path: '/' }, { label: 'Login' }],
};

export default function Breadcrumbs({
  items: customItems,
  className = '',
  separator,
  variant = 'default',
}: BreadcrumbsProps = {}) {
  const isDark = variant === 'on-dark' || variant === 'dark';
  const currentPathname = usePathname();
  const pathname =
    currentPathname?.endsWith('/') && currentPathname !== '/'
      ? currentPathname.slice(0, -1)
      : currentPathname || '';

  let items = customItems || routeMapping[pathname];

  if (!items && pathname.startsWith('/products/')) {
    const productId = pathname.split('/')[2];
    if (productId) {
      items = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: `Product ${productId}` },
      ];
    }
  }

  if (!items || items.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-sm ${className}`.trim()}>
      <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.path || item.href;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2 sm:gap-3"
            >
              {href && !isLast ? (
                <Link
                  href={href}
                  className="font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={`${
                    isDark ? 'text-white font-medium drop-shadow-sm' : 'text-gray-600'
                  } ${isLast ? 'truncate max-w-50 sm:max-w-md' : ''}`}
                  title={isLast ? item.label : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`${isDark ? 'text-white/70' : 'text-gray-400'} shrink-0`}
                >
                  {separator ? (
                    <span className="px-0.5 text-xs font-light">{separator}</span>
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
