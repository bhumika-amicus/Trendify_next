'use client';

import { useEffect } from 'react';
import type { OrderSummaryItem, OrderDetail } from '@/types';
import OrderCard from './OrderCard';

interface OrderListViewProps {
  orders: OrderSummaryItem[];
  initialOrderId?: number;
  initialDetail?: OrderDetail | null;
  initialDetailError?: string | null;
}

export default function OrderListView({
  orders,
  initialOrderId,
  initialDetail,
  initialDetailError,
}: OrderListViewProps) {
  useEffect(() => {
    if (initialOrderId) {
      const el = document.getElementById(`order-${initialOrderId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [initialOrderId]);

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isTargeted = order.orderId === initialOrderId;

        return (
          <OrderCard
            key={order.orderId}
            order={order}
            initialExpanded={isTargeted}
            initialDetail={isTargeted ? initialDetail : null}
            initialDetailError={isTargeted ? initialDetailError : null}
          />
        );
      })}
    </div>
  );
}
