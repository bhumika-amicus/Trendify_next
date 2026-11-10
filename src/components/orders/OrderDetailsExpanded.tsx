import { Package, MapPin, CreditCard, Receipt } from 'lucide-react';
import type { OrderDetail } from '@/types';
import { formatINR } from '@/utils/formatters';
import StateMessage from '@/components/common/StateMessage';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';

interface OrderDetailsExpandedProps {
  orderDetail: OrderDetail | null;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function OrderDetailsExpanded({
  orderDetail,
  isLoading,
  error,
  onRetry,
}: OrderDetailsExpandedProps) {
  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <StateMessage
          variant="error"
          compact
          title="Failed to load details"
          message={error}
          buttonText={onRetry ? 'Retry' : undefined}
          buttonVariant="outline"
          onAction={onRetry}
        />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <StateMessage
          variant="info"
          compact
          title="No Details Available"
          message="Unable to load order details for this item."
        />
      </div>
    );
  }

  const items = orderDetail.items ?? [];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Ordered Items List (No fake images, clean and accessible) */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Package size={14} className="text-brand-orange" />
          <span>Items Ordered ({items.length})</span>
        </h4>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.orderItemId}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-sm hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0 pr-4">
                <p className="font-semibold text-gray-900 truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty: <span className="font-bold text-gray-700">{item.quantity}</span> × {formatINR(item.price ?? 0)}
                </p>
              </div>
              <div className="text-right shrink-0 font-bold text-gray-900">
                {formatINR(item.itemSubtotal ?? 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Shipping & Payment 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Address */}
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-brand-orange" />
            <span>Shipping Address</span>
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900 text-sm">
              {orderDetail.shipping?.shippingName || 'Customer'}
            </p>
            <p>{orderDetail.shipping?.shippingAddress || 'Address not found'}</p>
            {orderDetail.shipping?.shippingCity ? (
              <p>
                {orderDetail.shipping.shippingCity}, {orderDetail.shipping.shippingState} - {orderDetail.shipping.shippingPostalCode}
              </p>
            ) : null}
            <p className="text-gray-500 pt-1">
              Method:{' '}
              <span className="font-semibold uppercase text-gray-700">
                {orderDetail.shipping?.shippingMethod || 'Standard'}
              </span>{' '}
              ({formatINR(orderDetail.shipping?.shippingCharge ?? orderDetail.shippingCharge ?? 0)})
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CreditCard size={14} className="text-brand-orange" />
            <span>Payment Information</span>
          </h4>
          <div className="text-xs text-gray-600 space-y-1.5">
            <div className="flex justify-between items-center">
              <span>Method:</span>
              <span className="font-semibold uppercase text-gray-800">
                {orderDetail.payment?.paymentMethod || 'COD'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span className="font-semibold text-emerald-700">
                {orderDetail.payment?.paymentStatus || 'Completed'}
              </span>
            </div>
            {orderDetail.payment?.transactionReference && (
              <div className="flex justify-between items-center text-xs text-gray-500 pt-0.5">
                <span>Ref:</span>
                <span className="font-mono text-gray-700 truncate max-w-[180px]">
                  {orderDetail.payment.transactionReference}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Price Breakdown Box */}
      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Receipt size={14} className="text-brand-orange" />
          <span>Payment Breakdown</span>
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatINR(orderDetail.subtotal ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatINR(orderDetail.shippingCharge ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%):</span>
            <span>{formatINR(orderDetail.tax ?? 0)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
            <span>Total Paid:</span>
            <span className="text-brand-orange text-base font-extrabold">
              {formatINR(orderDetail.totalAmount ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
