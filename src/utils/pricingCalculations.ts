import type { CartItem, CartSummary } from '@/types';

export const STANDARD_SHIPPING_CHARGE = 100;
export const TAX_RATE = 0.18; // 18% standard GST

export interface PricingSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  totalCount: number;
}

/**
 * Core unified calculation engine for cart and checkout invoices.
 * Enforces defensive array checks and exact 2-decimal currency rounding.
 */
export function calculatePricingSummary(
  items: CartItem[],
  shippingFee: number = STANDARD_SHIPPING_CHARGE
): PricingSummary {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const totalCount = safeItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const shipping = subtotal > 0 ? Math.max(0, shippingFee) : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    totalCount,
  };
}

/**
 * Calculates cart summary with standard shipping rate.
 * Maps unified pricing model to CartSummary interface.
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const summary = calculatePricingSummary(items, STANDARD_SHIPPING_CHARGE);
  return {
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    tax: summary.tax,
    finalTotal: summary.total,
    totalCount: summary.totalCount,
  };
}

/**
 * Calculates checkout summary with user-selected delivery option.
 * Maps unified pricing model to CheckoutSummaryData contract.
 */
export function calculateCheckoutSummary(
  items: CartItem[],
  shippingFee: number = STANDARD_SHIPPING_CHARGE
) {
  const summary = calculatePricingSummary(items, shippingFee);
  return {
    subtotal: summary.subtotal,
    shippingFee: summary.shipping,
    tax: summary.tax,
    total: summary.total,
    totalCount: summary.totalCount,
  };
}

