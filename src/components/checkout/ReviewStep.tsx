'use client';

import React from 'react';
import { Pencil, MapPin, CreditCard, Truck, Phone, Mail } from 'lucide-react';
import {
  SHIPPING_OPTIONS,
  type ShippingAddressFormData,
  type PaymentMethod,
} from '@/schemas/checkout';

interface ReviewStepProps {
  formData: ShippingAddressFormData;
  paymentMethod: PaymentMethod;
  onEditStep: (step: 1 | 2) => void;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery (COD)',
  card: 'Credit / Debit Card',
  upi: 'UPI / Net Banking',
};

export default function ReviewStep({
  formData,
  paymentMethod,
  onEditStep,
}: ReviewStepProps) {
  const selectedSpeed = SHIPPING_OPTIONS.find(
    (opt) => opt.id === formData.shippingMethod
  );

  return (
    <div className="space-y-6">
      {/* 1. Shipping Details Summary Card */}
      <section className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white sm:px-6">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider">
            <MapPin size={16} className="text-brand-orange" />
            <span>SHIPPING DETAILS</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-white transition-colors uppercase cursor-pointer"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 text-sm text-gray-700 space-y-2">
          <p className="font-bold text-gray-900 text-base">{formData.fullName}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />
              {formData.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {formData.email}
            </span>
          </div>
          <p className="text-gray-700 pt-1">
            {formData.address}
            {formData.apartment ? `, ${formData.apartment}` : ''}
          </p>
          <p className="text-gray-600">
            {formData.city}, {formData.state} - {formData.postalCode}, {formData.country}
          </p>
        </div>
      </section>

      {/* 2. Delivery Speed Summary Card */}
      <section className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white sm:px-6">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider">
            <Truck size={16} className="text-brand-orange" />
            <span>DELIVERY METHOD</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-white transition-colors uppercase cursor-pointer"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">
            {selectedSpeed?.title || 'Standard Delivery'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {selectedSpeed?.desc || 'Delivered in 5-7 business days'}
          </p>
        </div>
      </section>

      {/* 3. Payment Method Summary Card */}
      <section className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white sm:px-6">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider">
            <CreditCard size={16} className="text-brand-orange" />
            <span>PAYMENT METHOD</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-white transition-colors uppercase cursor-pointer"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">
            {PAYMENT_LABELS[paymentMethod]}
          </p>
        </div>
      </section>
    </div>
  );
}
