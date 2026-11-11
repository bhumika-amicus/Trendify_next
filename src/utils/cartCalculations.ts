import type { CartItem, CartSummary } from '@/types';

export const STANDARD_SHIPPING_CHARGE = 100;
export const TAX_RATE = 0.18;

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const totalCount = safeItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
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

export function calculateCheckoutSummary(
  items: CartItem[],
  shippingFee: number = STANDARD_SHIPPING_CHARGE
) {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const totalCount = safeItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const effectiveShipping = subtotal > 0 ? shippingFee : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + effectiveShipping + tax;

  return {
    subtotal,
    shippingFee: effectiveShipping,
    tax,
    total,
    totalCount,
  };
}
