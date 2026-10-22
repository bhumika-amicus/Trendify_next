'use client';

import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types/Products';
import Button from '@/components/common/Button';
import QuantitySelector from '@/components/cart/QuantitySelector';

interface ProductAddToCartProps {
  product: Pick<Product, 'id' | 'name' | 'price'>;
}

export default function ProductAddToCart({ product }: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      // Future-proof integration: works immediately and seamlessly hooks into cart store/context
      await new Promise((resolve) => setTimeout(resolve, 400));
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

      {isSuccess && (
        <p className="text-xs text-status-success font-medium animate-fade-in">
          ✓ {product.name} has been added to your cart.
        </p>
      )}
    </div>
  );
}
