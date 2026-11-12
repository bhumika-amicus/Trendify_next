'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import { addToCartAction } from '@/actions/cart';
import { useCartActions } from '@/context/CartContext';

/**
 * Shared client hook for adding a product to the cart.
 * Centralizes quantity state, validation, auth redirects, and global cart badge sync.
 */
export function useAddToCart(product: Pick<Product, 'id' | 'name'>) {
  const router = useRouter();
  const { setCartCount } = useCartActions();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

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

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    quantity,
    setQuantity,
    isAdding,
    isSuccess,
    handleAddToCart,
  };
}

