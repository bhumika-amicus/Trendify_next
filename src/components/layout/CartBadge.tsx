'use client';

import { useState, useEffect } from 'react';
import { CART_UPDATED_EVENT } from '@/utils/cartEvents';

interface CartBadgeProps {
  className?: string;
}

function getCartCountFromCookie(): number {
  if (typeof document === 'undefined') return 0;
  const match = document.cookie.match(/(?:^|;\s*)trendify_cart_count=([^;]*)/);
  return match ? parseInt(decodeURIComponent(match[1]), 10) || 0 : 0;
}

export default function CartBadge({ className }: CartBadgeProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {

    setCount(getCartCountFromCookie());

    const handleCartUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ count?: number }>).detail;
      if (typeof detail?.count === 'number') {
        setCount(detail.count);
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
  }, []);

  if (count <= 0) return null;

  return (
    <span
      className={
        className ||
        'absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm'
      }
      aria-label={`${count} items in cart`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
