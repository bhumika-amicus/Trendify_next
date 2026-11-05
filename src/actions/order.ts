'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PlaceOrderSchema } from '@/schemas/checkout';
import { clearBackendCart, getBackendCartCount } from '@/services/serverCartService';
import {
  createAddressServer,
  getAddressesServer,
} from '@/services/serverAddressService';
import {
  createCheckoutServer,
  processMockPaymentServer,
  getOrderDetailServer,
  reorderOrderServer,
} from '@/services/serverOrderService';
import type { OrderDetail } from '@/types';

const OrderActionPayloadSchema = PlaceOrderSchema.extend({
  selectedAddressId: z.number().nullable().optional(),
});

export interface PlaceOrderResult {
  success: boolean;
  orderId?: number;
  requireAuth?: boolean;
  message?: string;
  error?: string;
}


export async function placeOrderAction(
  rawInput: unknown
): Promise<PlaceOrderResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to complete your checkout.',
    };
  }

  const parsed = OrderActionPayloadSchema.safeParse(rawInput);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || 'Invalid checkout information.',
    };
  }

  const {
    fullName,
    address,
    apartment,
    city,
    state,
    postalCode,
    country,
    shippingMethod,
    paymentMethod,
    selectedAddressId,
  } = parsed.data;

  try {
    let resolvedAddressId = selectedAddressId;

    // 1. Verify address ownership or create new address in backend database
    if (resolvedAddressId) {
      const userAddresses = await getAddressesServer(sessionToken);
      const isOwner = userAddresses.some((a) => a.addressId === resolvedAddressId);
      if (!isOwner) {
        return {
          success: false,
          error: 'The selected shipping address is invalid. Please choose a valid address.',
        };
      }
    } else {
      const addressRes = await createAddressServer(sessionToken, {
        addressLine1: address,
        addressLine2: apartment || null,
        city,
        state,
        postalCode,
        country,
        isDefault: false,
      });

      if (!addressRes?.addressId) {
        return {
          success: false,
          error: 'Failed to register shipping address with the server.',
        };
      }

      resolvedAddressId = addressRes.addressId;
    }

    // 2. Call Azure Checkout API: POST /api/v1/checkout
    const checkoutRes = await createCheckoutServer(sessionToken, {
      addressId: resolvedAddressId,
      shippingMethod,
      paymentMethod,
    });

    if (!checkoutRes || !checkoutRes.orderId) {
      if (checkoutRes?.stockIssues && checkoutRes.stockIssues.length > 0) {
        const firstIssue = checkoutRes.stockIssues[0];
        const itemName = firstIssue?.productName ? ` "${firstIssue.productName}"` : '';
        return {
          success: false,
          error: `Item${itemName} in your cart is currently out of stock. Please adjust quantities.`,
        };
      }
      if (checkoutRes?.priceChanges && checkoutRes.priceChanges.length > 0) {
        const firstChange = checkoutRes.priceChanges[0];
        const itemName = firstChange?.productName ? ` "${firstChange.productName}"` : '';
        return {
          success: false,
          error: `Price for${itemName} has updated. Please review your cart.`,
        };
      }
      return {
        success: false,
        error:
          checkoutRes?.message ||
          'Unable to create checkout order. Please try again.',
      };
    }

    const orderId = checkoutRes.orderId;

    // 3. Call Azure Mock Payment Gateway: POST /api/payments/mock
    const paymentRes = await processMockPaymentServer(sessionToken, {
      orderId,
      paymentMethod,
    });

    if (!paymentRes || paymentRes.paymentStatus !== 'Success') {
      return {
        success: false,
        error:
          paymentRes?.message ||
          'Payment processing failed. Please retry or choose another payment method.',
      };
    }

    // 4. Success! Clear backend cart in database
    await clearBackendCart(sessionToken);

    // 5. Revalidate Next.js router cache for /cart and /orders
    revalidatePath('/cart');
    revalidatePath('/orders');

    console.log(
      `[CHECKOUT] Order #${orderId} successfully placed for ${fullName}`
    );

    return {
      success: true,
      orderId,
      message: 'Order placed successfully!',
    };
  } catch (error) {
    console.error('[CHECKOUT] Order placement failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while placing your order.',
    };
  }
}

export interface ReorderActionResult {
  success: boolean;
  requireAuth?: boolean;
  count?: number;
  message?: string;
  error?: string;
}

export async function reorderAction(
  orderId: number
): Promise<ReorderActionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to reorder items.',
    };
  }

  if (typeof orderId !== 'number' || orderId <= 0 || isNaN(orderId)) {
    return {
      success: false,
      error: 'Invalid order reference.',
    };
  }

  try {
    const res = await reorderOrderServer(sessionToken, orderId);

    if (!res.success) {
      return {
        success: false,
        error: res.error || 'Failed to reorder items. Some products may be unavailable.',
      };
    }

    // Invalidate cart path cache on the server
    revalidatePath('/cart');

    // Retrieve fresh backend cart badge count
    const totalCount = await getBackendCartCount(sessionToken);

    return {
      success: true,
      count: totalCount,
      message: res.message || 'Items from order added to cart successfully.',
    };
  } catch (error) {
    console.error(`[ORDER] Failed to reorder items for order #${orderId}:`, error);
    return {
      success: false,
      error: 'Failed to reorder items. Please try again.',
    };
  }
}

export interface FetchOrderDetailResult {
  success: boolean;
  requireAuth?: boolean;
  order?: OrderDetail | null;
  error?: string;
}

export async function fetchOrderDetailAction(
  orderId: number
): Promise<FetchOrderDetailResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to view order details.',
    };
  }

  if (typeof orderId !== 'number' || orderId <= 0 || isNaN(orderId)) {
    return {
      success: false,
      error: 'Invalid order reference.',
    };
  }

  try {
    const res = await getOrderDetailServer(sessionToken, orderId);

    if (!res.success || !res.order) {
      return {
        success: false,
        error: res.error || 'Order details could not be found.',
      };
    }

    return {
      success: true,
      order: res.order,
    };
  } catch (error) {
    console.error(`[ORDER] Failed to fetch order details for order #${orderId}:`, error);
    return {
      success: false,
      error: 'Failed to load order details.',
    };
  }
}
