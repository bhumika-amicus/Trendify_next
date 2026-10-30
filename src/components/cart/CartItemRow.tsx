'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Loader2 } from 'lucide-react';
import type { CartItem } from '@/types';
import QuantitySelector from './QuantitySelector';
import { formatINR } from '@/utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isPending?: boolean;
}

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  isPending = false,
}: CartItemRowProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === item.quantity || isPending) return;
    if (newQuantity <= 0) {
      onRemove(item.productId);
    } else {
      onQuantityChange(item.productId, newQuantity);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4 transition-opacity duration-200 ${
        isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Product Info (Thumbnail + Name + Remove Button) */}
      <div className="flex items-center flex-1 w-full gap-4">
        <Link
          href={`/products/${item.productId}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-gray-50 border border-gray-200"
        >
          <Image
            src={item.imageUrl || '/placeholder.jpg'}
            alt={item.productName}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        </Link>

        <div className="flex flex-col min-w-0">
          <Link
            href={`/products/${item.productId}`}
            className="font-bold text-gray-800 text-base md:text-lg mb-2 hover:text-brand-orange transition-colors line-clamp-2"
          >
            {item.productName}
          </Link>

          <button
            type="button"
            className="text-xs md:text-sm self-start text-red-500 hover:text-red-700 hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 p-0 disabled:opacity-50"
            onClick={() => onRemove(item.productId)}
            disabled={isPending}
            aria-label={`Remove ${item.productName} from cart`}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin text-red-500" />
            ) : (
              <Trash2 size={14} />
            )}
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Unit Price */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Unit Price</span>
        <span className="text-gray-800 text-base md:text-lg">
          {formatINR(item.price)}
        </span>
      </div>

      {/* Quantity Stepper */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Qty</span>
        <div>
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            disabled={isPending}
            minQuantity={0}
          />
        </div>
      </div>

      {/* Line Total */}
      <div className="w-full md:w-32 flex justify-between md:justify-end items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Total</span>
        <span className="font-bold text-brand-orange text-base md:text-lg">
          {formatINR(item.itemSubtotal)}
        </span>
      </div>
    </div>
  );
}

export default React.memo(CartItemRow);
