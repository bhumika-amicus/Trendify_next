'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  AddToCartSchema,
  UpdateCartQuantitySchema,
  RemoveCartItemSchema,
} from '@/schemas/cart';
import { getCartFromCookies, saveCartToCookies } from '@/lib/cart';
import { getProductByIdServer } from '@/services/serverProductService';
import {
  addBackendCartItem,
  updateBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
} from '@/services/serverCartService';
import type { CartItem } from '@/types';

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
 * caches in HTTP cookies for 0ms SSR, and revalidates /cart.
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
    // 1. Sync with Azure .NET backend database
    const backendRes = await addBackendCartItem(sessionToken, productId, quantity);
    if (!backendRes.success) {
      return {
        success: false,
        error: backendRes.error || 'Failed to sync with cart server.',
      };
    }

    // 2. Update local cookie cache for instant SSR and client badge
    const existingCart = await getCartFromCookies();
    const existingIndex = existingCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex >= 0) {
      const existingItem = existingCart[existingIndex];
      const updatedQuantity = Math.min(99, existingItem.quantity + quantity);
      existingCart[existingIndex] = {
        ...existingItem,
        quantity: updatedQuantity,
        itemSubtotal: existingItem.price * updatedQuantity,
      };
    } else {
      const product = await getProductByIdServer(productId);

      if (!product) {
        return {
          success: false,
          error: 'Product not found or unavailable.',
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        quantity,
        itemSubtotal: product.price * quantity,
      };

      existingCart.push(newItem);
    }

    await saveCartToCookies(existingCart);
    revalidatePath('/cart');

    const totalCount = existingCart.reduce((sum, item) => sum + item.quantity, 0);

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
 * Syncs with Azure .NET backend and updates cookies.
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
      await removeBackendCartItem(sessionToken, productId);
    } else {
      await updateBackendCartItem(sessionToken, productId, quantity);
    }

    // 2. Update local cookie cache
    const existingCart = await getCartFromCookies();

    let updatedCart: CartItem[];
    if (quantity <= 0) {
      updatedCart = existingCart.filter((item) => item.productId !== productId);
    } else {
      updatedCart = existingCart.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            itemSubtotal: item.price * quantity,
          };
        }
        return item;
      });
    }

    await saveCartToCookies(updatedCart);
    revalidatePath('/cart');

    const totalCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);

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
 * Syncs with Azure .NET backend and updates cookies.
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
    await removeBackendCartItem(sessionToken, productId);

    // 2. Update local cookie cache
    const existingCart = await getCartFromCookies();
    const updatedCart = existingCart.filter((item) => item.productId !== productId);

    await saveCartToCookies(updatedCart);
    revalidatePath('/cart');

    const totalCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);

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
    await saveCartToCookies([]);
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
