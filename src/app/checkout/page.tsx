import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CheckoutView from '@/components/checkout/CheckoutView';
import { getCartFromCookies } from '@/lib/cart';
import { getCurrentUser } from '@/lib/session';
import { getAddressesServer } from '@/services/serverAddressService';
import { getCountries, getStates, getCities } from '@/services/locationService';

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

  // Parallel server hydration: Cart, User Session, Saved Addresses & Countries
  const [items, user, savedAddresses, initialCountries] = await Promise.all([
    getCartFromCookies(),
    getCurrentUser(),
    getAddressesServer(sessionToken),
    getCountries(),
  ]);

  // Empty cart guard: Instantly redirect before sending HTML to browser
  if (!items || items.length === 0) {
    redirect('/products?emptyCart=true');
  }

  // If user has a saved address, pre-hydrate its specific states and cities
  const defaultAddr =
    savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;

  const [initialStates, initialCities] = await Promise.all([
    defaultAddr?.country ? getStates(defaultAddr.country) : Promise.resolve([]),
    defaultAddr?.country && defaultAddr?.state
      ? getCities(defaultAddr.country, defaultAddr.state)
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <Breadcrumbs />
      <CheckoutView
        initialItems={items}
        initialUser={user}
        initialAddresses={savedAddresses}
        initialCountries={initialCountries}
        initialStates={initialStates}
        initialCities={initialCities}
      />
    </div>
  );
}
