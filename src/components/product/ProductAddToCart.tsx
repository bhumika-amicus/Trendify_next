'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import Button from '@/components/common/Button';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { addToCartAction } from '@/actions/cart';
import { useCartActions } from '@/context/CartContext';

interface ProductAddToCartProps {
  product: Pick<Product, 'id' | 'name' | 'price'>;
}

export default function ProductAddToCart({ product }: ProductAddToCartProps) {
  const router = useRouter();
  const { setCartCount } = useCartActions();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;

    if (quantity > 99) {
      toast.error('Maximum quantity limit is 99 items.');
      setQuantity(99);
      return;
    }

    if (quantity < 1) {
      toast.error('Please select at least 1 item.');
      setQuantity(1);
      return;
    }

    setIsAdding(true);

    try {
      const res = await addToCartAction({ productId: product.id, quantity });
      if (!res.success) {
        if (res.requireAuth) {
          toast.error('Please log in to add items to your cart.');
          const currentPath =
            typeof window !== 'undefined'
              ? `${window.location.pathname}${window.location.search}`
              : '/products';
          router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
          return;
        }
        toast.error(res.error || 'Failed to add item to cart.');
        return;
      }
      if (typeof res.count === 'number') {
        setCartCount(res.count);
      }
      toast.success(`${product.name} added to cart!`);
      setIsSuccess(true);
      setQuantity(1);
      setTimeout(() => setIsSuccess(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          disabled={isAdding}
          className="mx-0!"
        />

        <Button
          variant="primary"
          className="w-full px-10 py-3 text-base sm:w-auto flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            'ADDING TO CART...'
          ) : isSuccess ? (
            <>
              <Check size={18} className="text-white" />
              <span>ADDED TO CART!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
