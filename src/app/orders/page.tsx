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

export const metadata = {
  title: 'My Orders | Trendify',
  description: 'Track delivery progress, inspect items, and reorder from your purchase history on Trendify.',
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    orderId?: string;
  }>;
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

  // Concurrently prefetch order history and targeted order details on the server
  const [historyResult, targetedDetailResult] = await Promise.all([
    getOrderHistoryServer(user.token, { status }),
    parsedOrderId
      ? getOrderDetailServer(user.token, parsedOrderId)
      : Promise.resolve(null),
  ]);

  const initialDetail = targetedDetailResult?.success ? targetedDetailResult.order ?? null : null;
  const initialDetailError =
    targetedDetailResult && !targetedDetailResult.success
      ? targetedDetailResult.error ?? 'Unable to load order details.'
      : null;

  // Safe retry link preserving active status filter
  const retryHref = status
    ? `/orders?${new URLSearchParams({ status }).toString()}`
    : '/orders';

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

      {/* Backend Error State */}
      {historyResult.error && (
        <StateMessage
          variant="error"
          title="Failed to load orders"
          message={historyResult.error}
          buttonText="Retry"
          actionHref={retryHref}
          className="my-8"
        />
      )}

      {/* Empty State */}
      {!historyResult.error && historyResult.orders.length === 0 && (
        <StateMessage
          variant="empty"
          title="No orders yet"
          message={
            status && status !== 'all'
              ? `You have no ${status.toLowerCase()} orders at the moment.`
              : 'Looks like you have not placed any orders yet. Start shopping to explore our latest arrivals!'
          }
          buttonText={status && status !== 'all' ? 'View All Orders' : 'Start Shopping'}
          actionHref={status && status !== 'all' ? '/orders' : '/products'}
          className="my-8"
        />
      )}

      {!historyResult.error && historyResult.orders.length > 0 && (
        <OrderListView
          orders={historyResult.orders}
          initialOrderId={parsedOrderId}
          initialDetail={initialDetail}
          initialDetailError={initialDetailError}
        />
      )}
    </div>
  );
}
