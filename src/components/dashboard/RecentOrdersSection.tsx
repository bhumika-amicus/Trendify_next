import Link from 'next/link';
import { Package, ArrowRight, PackageOpen } from 'lucide-react';
import { getRecentOrdersServer } from '@/services/serverOrderService';
import RecentOrderItem from './RecentOrderItem';

interface RecentOrdersSectionProps {
  token?: string;
}

/**
 * Async Server Component:
 * Fetches and displays recent orders for the customer.
 * Uses simulated latency to demonstrate independent Suspense streaming.
 */
export default async function RecentOrdersSection({ token }: RecentOrdersSectionProps) {
  const orders = await getRecentOrdersServer(token, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      {/* Section Header with "View All Orders" Navigation Link */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Package size={16} className="text-brand-orange" /> Recent Orders
        </h3>

        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors"
          title="View all your past orders"
        >
          <span>View all orders</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Orders List or Empty State */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <RecentOrderItem key={order.orderId} order={order} />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-center">
          <PackageOpen size={36} className="text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-800 text-sm">No orders placed yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Once you complete a purchase, your order history and tracking updates will appear here.
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-5 py-2 bg-brand-orange text-white text-xs font-bold rounded-md hover:bg-brand-orange/90 transition-colors shadow-xs uppercase tracking-wider"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
