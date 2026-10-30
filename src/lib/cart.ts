import { cookies } from 'next/headers';
import { StoredCartSchema } from '@/schemas/cart';
import type { CartItem } from '@/types';

export const CART_COOKIE_NAME = 'trendify_cart';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Reads and validates the cart from HTTP cookies.
 * Safe for use inside Server Components and Server Actions.
 */
export async function getCartFromCookies(): Promise<CartItem[]> {
  try {
    const cookieStore = await cookies();
    const rawCart = cookieStore.get(CART_COOKIE_NAME)?.value;

    if (!rawCart) {
      return [];
    }

    const parsedJson = JSON.parse(rawCart);
    const result = StoredCartSchema.safeParse(parsedJson);

    if (!result.success) {
      console.warn('[CART] Invalid cart format in cookie, resetting.');
      return [];
    }

    return result.data.map((item) => ({
      ...item,
      itemSubtotal: item.price * item.quantity,
    }));
  } catch (err) {
    console.error('[CART] Error reading cart cookie:', err);
    return [];
  }
}

/**
 * Serializes and saves the cart to HTTP cookies.
 * Must be called from Server Actions or Route Handlers.
 */
export async function saveCartToCookies(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies();

  // Strip computed properties (itemSubtotal) before persisting
  const storageData = items.map(({ productId, productName, price, imageUrl, quantity }) => ({
    productId,
    productName,
    price,
    imageUrl: imageUrl || '',
    quantity,
  }));

  // Validate payload before writing to cookie
  const validated = StoredCartSchema.parse(storageData);

  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(validated), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
  });

  // Also set a non-httpOnly item count cookie so client components (like NavBar) can read it synchronously
  const totalCount = validated.reduce((sum, item) => sum + item.quantity, 0);
  cookieStore.set('trendify_cart_count', String(totalCount), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
  });
}
