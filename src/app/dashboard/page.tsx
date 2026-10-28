import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import DefaultAddressSection from '@/components/dashboard/DefaultAddressSection';
import AddressSkeleton from '@/components/dashboard/AddressSkeleton';
import RecentOrdersSection from '@/components/dashboard/RecentOrdersSection';
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton';

export const metadata = {
  title: 'Dashboard | Trendify',
  description: 'Manage your account, view saved addresses, and track recent orders on Trendify.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Personalized Welcome Header (Static Server Render: 0ms) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, <span className="text-brand-orange">{user.name}</span>!
        </h1>
        <p className="mt-1.5 text-sm text-gray-600">
          Manage your account profile, default shipping address, and view your recent order history.
        </p>
      </div>

      {/* User Profile Card: Rendered instantly at 0ms (no slow network call) */}
      <UserProfileCard user={user} />

      {/* Section 1: Default Address (Independent Suspense Boundary 1) */}
      <section aria-labelledby="shipping-address-heading">
        <h2 id="shipping-address-heading" className="sr-only">
          Shipping Address
        </h2>
        <Suspense fallback={<AddressSkeleton />}>
          <DefaultAddressSection token={user.token} />
        </Suspense>
      </section>

      {/* Section 2: Recent Orders (Independent Suspense Boundary 2) */}
      <section aria-labelledby="recent-orders-heading">
        <h2 id="recent-orders-heading" className="sr-only">
          Recent Orders
        </h2>
        <Suspense fallback={<RecentOrdersSkeleton />}>
          <RecentOrdersSection token={user.token} />
        </Suspense>
      </section>
    </div>
  );
}
