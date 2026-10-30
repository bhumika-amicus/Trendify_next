'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem, CartSummary } from '@/types';
import CartItemRow from './CartItemRow';
import CartOrderSummary from './CartOrderSummary';
import StateMessage from '@/components/common/StateMessage';
import { updateCartQuantityAction, removeCartItemAction } from '@/actions/cart';
import { calculateCartSummary } from '@/utils/cartCalculations';
import { emitCartUpdate } from '@/utils/cartEvents';

interface CartViewProps {
  items: CartItem[];
  summary?: CartSummary;
}

type OptimisticAction =
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'REMOVE'; productId: number };

export default function CartView({ items }: CartViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Optimistic state updates locally in 0ms before the server response
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (state: CartItem[], action: OptimisticAction) => {
      switch (action.type) {
        case 'UPDATE_QTY':
          return state
            .map((item) =>
              item.productId === action.productId
                ? {
                    ...item,
                    quantity: action.quantity,
                    itemSubtotal: item.price * action.quantity,
                  }
                : item
            )
            .filter((item) => item.quantity > 0);
        case 'REMOVE':
          return state.filter((item) => item.productId !== action.productId);
        default:
          return state;
      }
    }
  );

  const optimisticSummary = calculateCartSummary(optimisticItems);

  const handleQuantityChange = (productId: number, quantity: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'UPDATE_QTY', productId, quantity });
      const res = await updateCartQuantityAction({ productId, quantity });
      if (!res.success && res.requireAuth) {
        router.push('/login?callbackUrl=/cart');
        return;
      }
      emitCartUpdate(res.count);
    });
  };

  const handleRemove = (productId: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'REMOVE', productId });
      const res = await removeCartItemAction({ productId });
      if (!res.success && res.requireAuth) {
        router.push('/login?callbackUrl=/cart');
        return;
      }
      emitCartUpdate(res.count);
    });
  };

  if (optimisticItems.length === 0) {
    return (
      <div className="py-12">
        <StateMessage
          title="Your Cart is Empty"
          message="Looks like you haven't added anything to your cart yet."
          buttonText="Browse Products"
          actionHref="/products"
          variant="empty"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Cart Items List */}
      <div className="flex-1 w-full">
        {/* Desktop Table Header */}
        <div className="hidden md:flex bg-gray-900 text-white font-bold py-3 px-4 mb-2 gap-4 rounded-t-md">
          <div className="flex-1">Product</div>
          <div className="w-32 text-center">Unit Price</div>
          <div className="w-32 text-center">Qty</div>
          <div className="w-32 text-right">Total</div>
        </div>

        {/* Item Rows */}
        <div className="flex flex-col border-t border-gray-200 md:border-t-0">
          {optimisticItems.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              isPending={isPending}
            />
          ))}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <CartOrderSummary summary={optimisticSummary} isPending={isPending} />
    </div>
  );
}

