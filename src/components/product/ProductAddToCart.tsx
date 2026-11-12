'use client';

import { Check, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import Button from '@/components/common/Button';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { useAddToCart } from '@/hooks/useAddToCart';

interface ProductAddToCartProps {
  product: Pick<Product, 'id' | 'name' | 'price'>;
}

export default function ProductAddToCart({ product }: ProductAddToCartProps) {
  const { quantity, setQuantity, isAdding, isSuccess, handleAddToCart } =
    useAddToCart(product);

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
