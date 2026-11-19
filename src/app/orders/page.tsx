import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/utils/session';
import {
  getOrderHistoryServer,
  getOrderDetailServer,
} from '@/services/serverOrderService';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import StateMessage from '@/components/common/StateMessage';
import OrderFilterTabs from '@/components/orders/OrderFilterTabs';
import OrderListView from '@/components/orders/OrderListView';
import OrderCardSkeleton from '@/components/orders/OrderCardSkeleton';
import { buildUrl } from '@/utils/urlHelpers';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'Track delivery progress, inspect items, and reorder from your purchase history on Trendify.',
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    orderId?: string;
  }>;
}

interface OrdersListSectionProps {
  token: string;
  status?: string;
  parsedOrderId?: number;
}

/**
 * Async Server Component: Fetches order history and targeted order details.
 * Suspended independently by status so tab switching streams fresh skeletons instantly.
 */
async function OrdersListSection({
  token,
  status,
  parsedOrderId,
}: OrdersListSectionProps) {
  const [historyResult, targetedDetailResult] = await Promise.all([
    getOrderHistoryServer(token, { status }),
    parsedOrderId
      ? getOrderDetailServer(token, parsedOrderId)
      : Promise.resolve(null),
  ]);

  const initialDetail = targetedDetailResult?.success
    ? targetedDetailResult.order ?? null
    : null;
  const initialDetailError =
    targetedDetailResult && !targetedDetailResult.success
      ? targetedDetailResult.error ?? 'Unable to load order details.'
      : null;

  const retryHref = buildUrl('/orders', { status });

  if (historyResult.error) {
    return (
      <StateMessage
        variant="error"
        title="Failed to load orders"
        message={historyResult.error}
        buttonText="Retry"
        actionHref={retryHref}
        className="my-8"
      />
    );
  }

  if (historyResult.orders.length === 0) {
    return (
      <StateMessage
        variant="empty"
        title="No orders yet"
        message={
          status && status !== 'all'
            ? `You have no ${status.toLowerCase()} orders at the moment.`
            : 'No orders yet. Start shopping!'
        }
        buttonText={status && status !== 'all' ? 'View All Orders' : 'Start Shopping'}
        actionHref={status && status !== 'all' ? '/orders' : '/products'}
        className="my-8"
      />
    );
  }

  return (
    <OrderListView
      orders={historyResult.orders}
      initialOrderId={parsedOrderId}
      initialDetail={initialDetail}
      initialDetailError={initialDetailError}
    />
  );
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?callbackUrl=/orders');
  }

  const { status, orderId } = await searchParams;

  // Strict positive-integer validation
  const numOrderId = Number(orderId);
  const parsedOrderId =
    Number.isInteger(numOrderId) && numOrderId > 0 ? numOrderId : undefined;

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My <span className="text-brand-orange">Orders</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track delivery progress, inspect ordered items, and reorder from your past purchases.
        </p>
      </div>

      <OrderFilterTabs activeStatus={status} />

      <Suspense
        key={`${status ?? 'all'}-${parsedOrderId ?? 'none'}`}
        fallback={
          <div className="space-y-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        }
      >
        <OrdersListSection
          token={user.token}
          status={status}
          parsedOrderId={parsedOrderId}
        />
      </Suspense>
    </div>
  );
}
