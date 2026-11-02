'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  AddToCartSchema,
  UpdateCartQuantitySchema,
  RemoveCartItemSchema,
} from '@/schemas/cart';
import { setCartCountCookie } from '@/lib/cart';
import {
  addBackendCartItem,
  updateBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
  getBackendCartCount,
} from '@/services/serverCartService';

export interface CartActionResult {
  success: boolean;
  requireAuth?: boolean;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Server Action to add an item to the cart.
 * Requires user authentication, syncs with Azure .NET backend,
 * updates the lightweight cart count cookie, and revalidates /cart.
 */
export async function addToCartAction(
  rawInput: unknown
): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to add items to your cart.',
    };
  }

  const parsed = AddToCartSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid product details.',
    };
  }

  const { productId, quantity } = parsed.data;

  try {
    // 1. Sync directly with Azure .NET backend database
    const backendRes = await addBackendCartItem(sessionToken, productId, quantity);
    if (!backendRes.success) {
      return {
        success: false,
        error: backendRes.error || 'Failed to sync with cart server.',
      };
    }

    // 2. Fetch fresh cart count from Azure backend
    const totalCount = await getBackendCartCount(sessionToken);

    // 3. Update the lightweight count cookie for 0ms client badge hydration
    await setCartCountCookie(totalCount);
    revalidatePath('/cart');

    return {
      success: true,
      count: totalCount,
      message: 'Product added to cart successfully.',
    };
  } catch (error) {
    console.error('[CART] Failed to add item to cart:', error);
    return {
      success: false,
      error: 'Failed to add item to cart. Please try again.',
    };
  }
}

/**
 * Server Action to update the quantity of an item in the cart.
 * Syncs with Azure .NET backend and updates the count cookie.
 */
export async function updateCartQuantityAction(
  rawInput: unknown
): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to manage your cart.',
    };
  }

  const parsed = UpdateCartQuantitySchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid quantity.',
    };
  }

  const { productId, quantity } = parsed.data;

  try {
    // 1. Sync with Azure .NET backend
    if (quantity <= 0) {
      const res = await removeBackendCartItem(sessionToken, productId);
      if (!res.success) {
        return { success: false, error: res.error || 'Failed to remove item.' };
      }
    } else {
      const res = await updateBackendCartItem(sessionToken, productId, quantity);
      if (!res.success) {
        return { success: false, error: res.error || 'Failed to update item quantity.' };
      }
    }

    // 2. Fetch fresh total count from Azure
    const totalCount = await getBackendCartCount(sessionToken);
    await setCartCountCookie(totalCount);
    revalidatePath('/cart');

    return { success: true, count: totalCount };
  } catch (error) {
    console.error('[CART] Failed to update cart quantity:', error);
    return {
      success: false,
      error: 'Failed to update item quantity.',
    };
  }
}

/**
 * Server Action to remove an item completely from the cart.
 * Syncs with Azure .NET backend and updates the count cookie.
 */
export async function removeCartItemAction(
  rawInput: unknown
): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return {
      success: false,
      requireAuth: true,
      error: 'Please log in to manage your cart.',
    };
  }

  const parsed = RemoveCartItemSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid item identifier.',
    };
  }

  const { productId } = parsed.data;

  try {
    // 1. Sync with Azure .NET backend
    const res = await removeBackendCartItem(sessionToken, productId);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to remove item from cart.' };
    }

    // 2. Fetch fresh total count from Azure
    const totalCount = await getBackendCartCount(sessionToken);
    await setCartCountCookie(totalCount);
    revalidatePath('/cart');

    return { success: true, count: totalCount };
  } catch (error) {
    console.error('[CART] Failed to remove item from cart:', error);
    return {
      success: false,
      error: 'Failed to remove item from cart.',
    };
  }
}

/**
 * Server Action to clear the entire cart.
 */
export async function clearCartAction(): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (sessionToken) {
    await clearBackendCart(sessionToken);
  }

  try {
    await setCartCountCookie(0);
    revalidatePath('/cart');
    return { success: true, count: 0 };
  } catch (error) {
    console.error('[CART] Failed to clear cart:', error);
    return {
      success: false,
      error: 'Failed to clear cart.',
    };
  }
}
