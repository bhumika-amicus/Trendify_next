import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CheckoutView from '@/components/checkout/CheckoutView';
import { getCurrentUser } from '@/lib/session';
import { getAddressesServer } from '@/services/serverAddressService';
import { getBackendCart } from '@/services/serverCartService';
import { getCountries } from '@/services/locationService';
import type { CartItem } from '@/types';

export const metadata: Metadata = {
  title: 'Secure Checkout | Trendify',
  description:
    'Complete your purchase securely. Enter shipping address, choose delivery speed, and finalize your order on Trendify.',
};

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    redirect('/login?callbackUrl=/checkout');
  }

  // Parallel server hydration: Authoritative Azure Cart, User Session, Saved Addresses & Countries
  const [backendCart, user, savedAddresses, initialCountries] = await Promise.all([
    getBackendCart(sessionToken),
    getCurrentUser(),
    getAddressesServer(sessionToken),
    getCountries().catch(() => []),
  ]);

  const items: CartItem[] = backendCart.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: '',
    quantity: item.quantity,
    itemSubtotal: item.price * item.quantity,
  }));

  // Empty cart guard: Instantly redirect before sending HTML to browser
  if (!items || items.length === 0) {
    redirect('/products?emptyCart=true');
  }

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <Breadcrumbs />
      <CheckoutView
        initialItems={items}
        initialUser={user}
        initialAddresses={savedAddresses}
        initialCountries={initialCountries}
      />
    </div>
  );
}
