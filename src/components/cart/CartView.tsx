'use client';

import { useEffect, useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CartItem } from '@/types';
import CartItemRow from './CartItemRow';
import CartOrderSummary from './CartOrderSummary';
import StateMessage from '@/components/common/StateMessage';
import { updateCartQuantityAction, removeCartItemAction } from '@/actions/cart';
import { calculateCartSummary } from '@/utils/pricingCalculations';
import { useCartActions } from '@/context/CartContext';

interface CartViewProps {
  items: CartItem[];
}

type OptimisticAction =
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'DELETE_ITEM'; productId: number };

export default function CartView({ items }: CartViewProps) {
  const router = useRouter();
  const { setCartCount } = useCartActions();
  const [isPending, startTransition] = useTransition();

  // Optimistic state updates quantities and removals locally in 0ms before the server response
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
        case 'DELETE_ITEM':
          return state.filter((item) => item.productId !== action.productId);
        default:
          return state;
      }
    }
  );

  const optimisticSummary = calculateCartSummary(optimisticItems);

  useEffect(() => {
    setCartCount(optimisticSummary.totalCount);
  }, [optimisticSummary.totalCount, setCartCount]);

  const handleQuantityChange = async (productId: number, quantity: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'UPDATE_QTY', productId, quantity });

      const res = await updateCartQuantityAction({ productId, quantity });
      if (!res.success) {
        if (res.requireAuth) {
          toast.error('Please log in to manage your cart.');
          router.push('/login?callbackUrl=/cart');
          return;
        }
        toast.error(res.error || 'Failed to update quantity. Please try again.');
        router.refresh();
        return;
      }
      if (typeof res.count === 'number') {
        setCartCount(res.count);
      }
    });
  };

  const handleRemove = async (productId: number, productName?: string) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'DELETE_ITEM', productId });

      try {
        const res = await removeCartItemAction({ productId });
        if (!res.success) {
          if (res.requireAuth) {
            toast.error('Please log in to manage your cart.');
            router.push('/login?callbackUrl=/cart');
            return;
          }
          toast.error(res.error || 'Failed to remove item.');
          router.refresh();
          return;
        }

        if (typeof res.count === 'number') {
          setCartCount(res.count);
        }
        router.refresh();
        toast.success(
          productName ? `${productName} removed from cart` : 'Item removed from cart',
          { duration: 2500 }
        );
      } catch {
        toast.error('Failed to remove item. Please try again.', { duration: 3000 });
        router.refresh();
      }
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

  const itemCountText = `(${optimisticSummary.totalCount} ${
    optimisticSummary.totalCount === 1 ? 'Item' : 'Items'
  })`;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 mt-2">
        Shopping Cart {itemCountText}
      </h1>

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
              />
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <CartOrderSummary summary={optimisticSummary} isPending={isPending} />
      </div>
    </>
  );
}

