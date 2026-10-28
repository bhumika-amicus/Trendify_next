import Link from 'next/link';
import type { OrderSummaryItemDto } from '@/services/serverOrderService';
import { formatINR, formatDate } from '@/utils/formatters';
import OrderStatusBadge from './OrderStatusBadge';

interface RecentOrderItemProps {
  order: OrderSummaryItemDto;
}

/**
 * Presentation Component:
 * Renders an individual order row in the Recent Orders section.
 */
export default function RecentOrderItem({ order }: RecentOrderItemProps) {
  const formattedOrderId = `ORD-2026-${order.orderId.toString().padStart(3, '0')}`;

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Order Meta Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-sm">{formattedOrderId}</span>
          <OrderStatusBadge status={order.orderStatus} />
        </div>
        <p className="text-xs text-gray-500">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Amount and Details Link */}
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="text-right">
          <p className="text-xs text-gray-400">Total Amount</p>
          <p className="font-extrabold text-gray-900 text-base">
            {formatINR(order.totalAmount)}
          </p>
        </div>

        <Link
          href="/orders"
          className="text-xs font-medium px-3 py-1.5 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
