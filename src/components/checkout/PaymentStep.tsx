'use client';

import React from 'react';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import type { PaymentMethod } from '@/schemas/checkout';

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS = [
  {
    id: 'cod' as const,
    title: 'Cash on Delivery (COD)',
    description: 'Pay with cash upon physical delivery at your doorstep.',
    icon: Banknote,
  },
  {
    id: 'card' as const,
    title: 'Credit / Debit Card',
    description: 'Instant Visa, Mastercard, or RuPay card processing.',
    icon: CreditCard,
  },
  {
    id: 'upi' as const,
    title: 'UPI / Net Banking',
    description: 'Fast Google Pay, PhonePe, Paytm, or BHIM UPI processing.',
    icon: Smartphone,
  },
];

export default function PaymentStep({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentStepProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">
          Payment Method
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose how you would like to pay for your order.
        </p>
      </div>

      <div className="space-y-3">
        {PAYMENT_OPTIONS.map(({ id, title, description, icon: Icon }) => {
          const isSelected = paymentMethod === id;

          return (
            <label
              key={id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-orange bg-orange-50/20 ring-1 ring-brand-orange/40'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={id}
                checked={isSelected}
                onChange={() => onPaymentMethodChange(id)}
                className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 shrink-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
