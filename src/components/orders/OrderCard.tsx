'use client';

import { useState, memo } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { OrderSummaryItem, OrderDetail } from '@/types';
import { formatINR, formatDate } from '@/utils/formatters';
import { useCartActions } from '@/context/CartContext';
import { reorderAction, fetchOrderDetailAction } from '@/actions/order';
import Button from '@/components/common/Button';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetailsExpanded from './OrderDetailsExpanded';

interface OrderCardProps {
  order: OrderSummaryItem;
  initialExpanded?: boolean;
  initialDetail?: OrderDetail | null;
  initialDetailError?: string | null;
}

function OrderCard({
  order,
  initialExpanded = false,
  initialDetail = null,
  initialDetailError = null,
}: OrderCardProps) {
  const { setCartCount } = useCartActions();

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(initialDetailError);
  const [detail, setDetail] = useState<OrderDetail | null>(initialDetail);
  const [isReordering, setIsReordering] = useState(false);

  const formattedOrderId = `ORD-2026-${order.orderId.toString().padStart(3, '0')}`;
  const formattedDate = formatDate(order.createdAt);

  const statusLower = (order.orderStatus || '').toLowerCase().trim();
  const isDelivered = statusLower === 'delivered';

  // Lazy-load details when expanded on demand
  const loadOrderDetail = async () => {
    if (detail) return detail;
    setIsLoadingDetail(true);
    setErrorDetail(null);
    try {
      const res = await fetchOrderDetailAction(order.orderId);
      if (res.success && res.order) {
        setDetail(res.order);
        setErrorDetail(null);
        return res.order;
      } else {
        const msg = res.error || 'Failed to load order details.';
        setErrorDetail(msg);
        return null;
      }
    } catch {
      const msg = 'Unable to load order details. Please try again.';
      setErrorDetail(msg);
      return null;
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleToggleExpand = () => {
    if (isLoadingDetail) return; // Guard against concurrent duplicate clicks

    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);
    if (!detail) {
      void loadOrderDetail();
    }
  };

  const handleReorder = async () => {
    if (isReordering) return;
    setIsReordering(true);
    const toastId = toast.loading(`Adding items from order #${order.orderId} to cart...`);

    try {
      const res = await reorderAction(order.orderId);

      if (!res.success) {
        toast.error(res.error || 'Failed to reorder items.', { id: toastId });
        return;
      }

      // Synchronize cart count with navbar badge instantly
      if (typeof res.count === 'number') {
        setCartCount(res.count);
      }

      toast.success(res.message || 'Items added back to your cart!', { id: toastId });
    } catch {
      toast.error('Something went wrong while reordering.', { id: toastId });
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div
      id={`order-${order.orderId}`}
      className={`rounded-xl border bg-white p-5 mb-4 shadow-xs transition-all ${
        isExpanded ? 'border-brand-orange ring-1 ring-brand-orange/30' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Top Header Row: Order ID, Date, and Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex flex-wrap items-baseline gap-3 sm:gap-6">
          <span className="font-bold text-gray-900 text-base sm:text-lg">
            Order: {formattedOrderId}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Placed: {formattedDate}
          </span>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        {/* Left Info: Items Count & Total (shows actual count once loaded, truthful label when collapsed) */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">
            {detail?.items
              ? `${detail.items.length} ${detail.items.length === 1 ? 'Item' : 'Items'}`
              : 'Order Items'}
          </p>
          <p className="font-bold text-base sm:text-lg text-brand-orange">
            Total: {formatINR(order.totalAmount)}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end sm:self-center">
          {/* VIEW / HIDE DETAILS button (Uses outline variant to preserve clear visual hierarchy against the orange badge) */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToggleExpand}
            aria-expanded={isExpanded}
            aria-controls={`order-details-${order.orderId}`}
            className="tracking-wider text-xs font-bold gap-1.5"
          >
            <span>{isExpanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}</span>
            {isExpanded ? (
              <ChevronUp size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </Button>

          {/* REORDER button (Delivered orders only - uses primary variant with built-in loading spinner) */}
          {isDelivered && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isReordering}
              onClick={handleReorder}
              className="tracking-wider text-xs font-bold gap-1.5"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>REORDER</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Order Details Panel */}
      {isExpanded && (
        <div id={`order-details-${order.orderId}`}>
          <OrderDetailsExpanded
            orderDetail={detail}
            isLoading={isLoadingDetail}
            error={errorDetail}
            onRetry={loadOrderDetail}
          />
        </div>
      )}
    </div>
  );
}

export default memo(OrderCard);
