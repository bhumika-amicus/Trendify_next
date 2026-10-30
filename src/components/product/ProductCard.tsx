'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import RatingStars from '@/components/common/RatingStars';
import QuantitySelector from '@/components/cart/QuantitySelector';
import toast from 'react-hot-toast';
import { formatINR } from '@/utils/formatters';
import { addToCartAction } from '@/actions/cart';
import { emitCartUpdate } from '@/utils/cartEvents';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      if (onAddToCart) {
        onAddToCart(product, quantity);
      } else {
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
        emitCartUpdate(res.count);
        toast.success(`${product.name} added to cart!`);
      }
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const formattedTotalPrice = formatINR(product.price * quantity);

  return (
    <Card
      as="article"
      variant="elevated"
      hoverable
      className="h-full"
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
          size="sm"
          className="mt-auto w-full"
          onClick={handleAddToCart}
          isLoading={isAdding}
        >
          ADD TO CART
        </Button>
      </div>
    </Card>
  );
}

export default memo(ProductCard);
