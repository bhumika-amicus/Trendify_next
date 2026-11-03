'use client';

import { useCartCount } from '@/context/CartContext';

interface CartBadgeProps {
  className?: string;
}

/**
 * Isolated Cart Notification Pill.
 * Subscribes to in-memory cart state; only this component re-renders when count changes.
 */
export default function CartBadge({ className }: CartBadgeProps) {
  const count = useCartCount();

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
