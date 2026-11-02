import { cookies } from 'next/headers';

export const CART_COUNT_COOKIE_NAME = 'trendify_cart_count';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function setCartCountCookie(count: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COUNT_COOKIE_NAME, String(Math.max(0, count)), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

export async function getCartCountCookie(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(CART_COUNT_COOKIE_NAME)?.value;
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function clearCartCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COUNT_COOKIE_NAME);
  cookieStore.delete('trendify_cart');
}
