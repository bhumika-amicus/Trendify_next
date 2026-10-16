'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import RatingStars from '@/components/common/RatingStars';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { formatINR } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      if (onAddToCart) {
        onAddToCart(product, quantity);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const formattedTotalPrice = formatINR(product.price * quantity);

  return (
    <Card
      variant="elevated"
      className="transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.02] motion-reduce:transition-none"
    >
      <Link
        href={`/products/${product.id}`}
        className="relative flex h-40 w-full items-center justify-center border-b border-border-light bg-white max-[650px]:h-48 group overflow-hidden"
      >
        <Image
          src={product.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 650px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col px-4 py-3 text-center">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h2 className="m-0 mb-1.5 line-clamp-2 min-h-10 overflow-hidden text-base leading-[1.3] font-bold uppercase text-brand-orange">
            {product.name}
          </h2>
        </Link>

        {product.rating !== undefined && (
          <div className="mb-3 flex flex-col items-center justify-center gap-2">
            <RatingStars rating={product.rating} size="sm" scoreFormat="simple" />
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              disabled={isAdding}
            />
          </div>
        )}

        <div className="mb-3 flex items-baseline justify-center gap-1 whitespace-nowrap">
          <span className="text-base font-bold text-brand-orange">{formattedTotalPrice}</span>
        </div>

        <Button
          variant="primary"
          className="mt-auto w-full px-3! py-2! text-sm!"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'ADDING...' : 'ADD TO CART'}
        </Button>
      </div>
    </Card>
  );
}

export default memo(ProductCard);
