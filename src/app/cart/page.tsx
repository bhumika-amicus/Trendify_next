import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CartView from '@/components/cart/CartView';
import { getBackendCart } from '@/services/serverCartService';
import type { CartItem } from '@/types';

export const metadata: Metadata = {
  title: 'Shopping Cart | Trendify',
  description:
    'Review your cart items, quantities, subtotal, and proceed to secure checkout on Trendify.',
};

/**
 * Shopping Cart Page (React Server Component)
 * Enforces authentication, hydrates cart directly from the authoritative Azure .NET backend,
 * synchronizes the lightweight count cookie, and renders the interactive CartView.
 */
export default async function CartPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    redirect('/login?callbackUrl=/cart');
  }

  let items: CartItem[] = [];
  try {
    const backendCart = await getBackendCart(sessionToken);
    items = backendCart.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      imageUrl: '',
      quantity: item.quantity,
      itemSubtotal: item.price * item.quantity,
    }));
  } catch (err) {
    console.error('[CART_PAGE] Failed to fetch authoritative cart from backend:', err);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[60vh]">
      <Breadcrumbs />
      <CartView items={items} />
    </div>
  );
}
