import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CartView from '@/components/cart/CartView';
import {
  getCartFromCookies,
  saveCartToCookies,
  calculateCartSummary,
  CART_COOKIE_NAME,
} from '@/lib/cart';
import { getBackendCart } from '@/services/serverCartService';

export const metadata: Metadata = {
  title: 'Shopping Cart | Trendify',
  description:
    'Review your cart items, quantities, subtotal, and proceed to secure checkout on Trendify.',
};

/**
 * Shopping Cart Page (React Server Component)
 * Enforces authentication, hydrates cart from cookies or upstream .NET backend,
 * computes totals, and renders the interactive CartView with zero hydration delay.
 */
export default async function CartPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    redirect('/login?callbackUrl=/cart');
  }

  let items = await getCartFromCookies();

  // Only hydrate from the Azure backend database if the cart cookie has never been initialized
  const hasCartCookie = cookieStore.has(CART_COOKIE_NAME);
  if (!hasCartCookie) {
    try {
      const backendCart = await getBackendCart(sessionToken);
      if (backendCart.length > 0) {
        items = backendCart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          imageUrl: '',
          quantity: item.quantity,
          itemSubtotal: item.price * item.quantity,
        }));
        await saveCartToCookies(items);
      }
    } catch (err) {
      console.warn('[CART_PAGE] Failed to hydrate cart from backend:', err);
    }
  }

  const summary = calculateCartSummary(items);

  const itemCountText =
    items.length > 0
      ? `(${summary.totalCount} ${summary.totalCount === 1 ? 'Item' : 'Items'})`
      : '';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[60vh]">
      <Breadcrumbs />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 mt-2">
        Shopping Cart {itemCountText}
      </h1>

      <CartView items={items} summary={summary} />
    </div>
  );
}
