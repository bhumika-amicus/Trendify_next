import type { CartItem, CartSummary } from '@/types';

export const STANDARD_SHIPPING_CHARGE = 100; // ₹100 per Assignment 10
export const TAX_RATE = 0.08; // 8% per Assignment 10

/**
 * Pure calculation function for cart totals, shipping, and 8% tax.
 * Safe to run on both server and client (zero server-only dependencies).
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 0 ? STANDARD_SHIPPING_CHARGE : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const finalTotal = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    finalTotal,
    totalCount,
  };
}
