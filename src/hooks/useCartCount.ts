'use client';

import { useSyncExternalStore } from 'react';
import { CART_UPDATED_EVENT } from '@/utils/cartEvents';

function getClientCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

const getCartCountSnapshot = (): number => {
  const val = getClientCookie('trendify_cart_count');
  return val ? parseInt(val, 10) || 0 : 0;
};

const getServerSnapshot = (): number => 0;

function subscribeToCart(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Lightweight client hook to read the cart items count badge from cookies
 * and keep in sync via client events without revalidating server layouts.
 */
export function useCartCount(initialCount = 0): number {
  const count = useSyncExternalStore(
    subscribeToCart,
    getCartCountSnapshot,
    getServerSnapshot
  );

  return count || initialCount;
}

