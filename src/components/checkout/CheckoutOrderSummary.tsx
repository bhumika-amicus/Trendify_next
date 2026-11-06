'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CartItem } from '@/types';
import Button from '@/components/common/Button';
import { formatINR } from '@/utils/formatters';
import type { CheckoutStepNumber } from './CheckoutSteps';

export interface CheckoutSummaryData {
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  totalCount?: number;
}

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  summary: CheckoutSummaryData;
  currentStep: CheckoutStepNumber;
  isSubmitting?: boolean;
  onContinue?: () => void;
}

export default function CheckoutOrderSummary({
  items,
  summary,
  currentStep,
  isSubmitting = false,
  onContinue,
}: CheckoutOrderSummaryProps) {
  const totalItemCount =
    summary.totalCount ?? items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="w-full lg:w-80 xl:w-96 min-w-0 lg:sticky lg:top-6 self-start">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header Bar */}
        <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 font-bold tracking-wider text-white sm:px-6 text-sm">
          <ShoppingBag size={18} className="text-brand-orange" />
          <span>ORDER SUMMARY</span>
        </div>

        <div className="p-4 sm:p-6">
          {/* Scrollable Items Preview */}
          <div className="flex flex-col gap-3 mb-6 max-h-56 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-xs sm:text-sm text-gray-700 gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-50 border border-gray-200">
                    <Image
                      src={item.imageUrl || '/placeholder.jpg'}
                      alt={item.productName}
                      fill
                      sizes="40px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="shrink-0 font-medium text-gray-900">
                  {formatINR(item.itemSubtotal)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 mb-5" />

          {/* Pricing Breakdown */}
          <div className="flex flex-col gap-3 mb-5 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}):</span>
              <span className="font-medium text-gray-900">{formatINR(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping:</span>
              <span className="font-medium text-gray-900">
                {summary.shippingFee > 0 ? formatINR(summary.shippingFee) : 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (18%):</span>
              <span className="font-medium text-gray-900">{formatINR(summary.tax)}</span>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Grand Total */}
          <div className="flex justify-between items-baseline mb-6">
            <span className="font-bold text-lg text-gray-800">Total:</span>
            <span className="font-bold text-2xl text-brand-orange">{formatINR(summary.total)}</span>
          </div>

          {/* Contextual Action Button based on currentStep */}
          {currentStep === 1 && (
            <Button
              variant="primary"
              type="button"
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2 text-sm shadow-sm"
              onClick={onContinue}
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight size={16} />
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              variant="primary"
              type="button"
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2 text-sm shadow-sm"
              onClick={onContinue}
            >
              <span>CONTINUE TO REVIEW</span>
              <ArrowRight size={16} />
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <span>PLACE ORDER</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
