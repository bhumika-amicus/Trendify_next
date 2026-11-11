import {
  calculateCartSummary,
  calculateCheckoutSummary,
  STANDARD_SHIPPING_CHARGE,
} from '@/utils/cartCalculations';
import type { CartItem } from '@/types';

describe('cartCalculations utility', () => {
  const sampleItems: CartItem[] = [
    {
      productId: 1,
      productName: 'Mechanical Keyboard',
      price: 2000,
      quantity: 2,
      itemSubtotal: 4000,
    },
    {
      productId: 2,
      productName: 'Wireless Mouse',
      price: 1000,
      quantity: 1,
      itemSubtotal: 1000,
    },
  ];

  it('calculates subtotal, 18% tax, standard shipping, and final total accurately', () => {
    const summary = calculateCartSummary(sampleItems);

    // Subtotal: (2000 * 2) + (1000 * 1) = 5000
    expect(summary.subtotal).toBe(5000);

    // Total Count: 2 + 1 = 3 items
    expect(summary.totalCount).toBe(3);

    // Shipping: Subtotal > 0 applies STANDARD_SHIPPING_CHARGE (100)
    expect(summary.shipping).toBe(STANDARD_SHIPPING_CHARGE);

    // Tax: 5000 * 0.18 = 900
    expect(summary.tax).toBe(900);

    // Final Total: 5000 + 100 + 900 = 6000
    expect(summary.finalTotal).toBe(6000);
  });

  it('returns zero subtotal, zero shipping, and zero tax when cart is empty', () => {
    const summary = calculateCartSummary([]);

    expect(summary.subtotal).toBe(0);
    expect(summary.totalCount).toBe(0);
    expect(summary.shipping).toBe(0);
    expect(summary.tax).toBe(0);
    expect(summary.finalTotal).toBe(0);
  });

  it('handles custom shipping fees in calculateCheckoutSummary', () => {
    const checkoutSummary = calculateCheckoutSummary(sampleItems, 150);

    expect(checkoutSummary.subtotal).toBe(5000);
    expect(checkoutSummary.shippingFee).toBe(150);
    expect(checkoutSummary.tax).toBe(900);
    expect(checkoutSummary.total).toBe(6050);
  });

  it('handles null or undefined safely using defensive array fallback', () => {
    // @ts-expect-error Testing defensive runtime protection
    const summaryNull = calculateCartSummary(null);
    expect(summaryNull.subtotal).toBe(0);
    expect(summaryNull.totalCount).toBe(0);

    // @ts-expect-error Testing defensive runtime protection
    const summaryUndefined = calculateCartSummary(undefined);
    expect(summaryUndefined.subtotal).toBe(0);
    expect(summaryUndefined.totalCount).toBe(0);
  });
});

