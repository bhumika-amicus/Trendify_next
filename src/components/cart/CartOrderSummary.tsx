import React from 'react';
import Button from '@/components/common/Button';
import { formatINR } from '@/utils/formatters';
import type { CartSummary } from '@/types';

export interface CartOrderSummaryProps {
  summary: CartSummary;
  isPending?: boolean;
}

export default function CartOrderSummary({
  summary,
  isPending = false,
}: CartOrderSummaryProps) {
  const { subtotal, shipping, tax, finalTotal, totalCount } = summary;

  return (
    <div className="w-full lg:w-80 xl:w-96 self-start lg:sticky lg:top-6">
      <div className="border border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Header matching original design */}
        <div className="bg-gray-900 text-white font-bold py-3 px-6 tracking-wider text-sm">
          ORDER SUMMARY
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 text-gray-700 text-sm mb-6">
            <div className="flex justify-between">
              <span>
                Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'}):
              </span>
              <span className="font-medium text-gray-900">
                {formatINR(subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping (Standard):</span>
              <span className="font-medium text-gray-900">
                {shipping > 0 ? formatINR(shipping) : 'Free'}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span className="font-medium text-gray-900">
                {formatINR(tax)}
              </span>
            </div>
          </div>

          <hr className="border-brand-orange my-6" />

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg md:text-xl text-gray-800">
              Total:
            </span>
            <span className="font-bold text-2xl text-brand-orange">
              {formatINR(finalTotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              href="/checkout"
              variant="primary"
              className="w-full uppercase font-bold tracking-wider py-3 shadow-sm text-sm"
              disabled={isPending || totalCount === 0}
            >
              PROCEED TO CHECKOUT
            </Button>
            <Button
              href="/products"
              variant="secondary"
              className="w-full uppercase font-bold tracking-wider py-3 text-sm"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
