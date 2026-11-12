import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/utils/session';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CheckoutView from '@/components/checkout/CheckoutView';
import { getAddressesServer } from '@/services/serverAddressService';
import { getBackendCart } from '@/services/serverCartService';
import { getCountries } from '@/services/locationService';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description:
    'Complete your purchase securely. Enter shipping address, choose delivery speed, and finalize your order on Trendify.',
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?callbackUrl=/checkout');
  }

  // Parallel server hydration: Authoritative Azure Cart, Saved Addresses & Countries
  const [items, savedAddresses, initialCountries] = await Promise.all([
    getBackendCart(user.token),
    getAddressesServer(user.token),
    getCountries().catch(() => []),
  ]);

  // Empty cart guard: Instantly redirect before sending HTML to browser
  if (!items || items.length === 0) {
    redirect('/products?emptyCart=true');
  }

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <Breadcrumbs />
      <CheckoutView
        initialItems={items}
        initialAddresses={savedAddresses ?? []}
        initialCountries={initialCountries}
      />
    </div>
  );
}
