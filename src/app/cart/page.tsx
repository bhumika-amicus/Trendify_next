import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CartView from '@/components/cart/CartView';
import { getBackendCart } from '@/services/serverCartService';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description:
    'Review your cart items, quantities, subtotal, and proceed to secure checkout on Trendify.',
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    redirect('/login?callbackUrl=/cart');
  }

  const items = await getBackendCart(sessionToken);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[60vh]">
      <Breadcrumbs />
      <CartView items={items} />
    </div>
  );
}
