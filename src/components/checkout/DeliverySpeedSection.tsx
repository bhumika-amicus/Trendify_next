'use client';

import React from 'react';
import { Truck, Zap, Clock } from 'lucide-react';
import { SHIPPING_OPTIONS, type ShippingMethod } from '@/schemas/checkout';
import { formatINR } from '@/utils/formatters';

interface DeliverySpeedSectionProps {
  selectedSpeed: ShippingMethod;
  onChange: (speed: ShippingMethod) => void;
  error?: string;
}

const SPEED_ICONS = {
  standard: Truck,
  express: Zap,
  overnight: Clock,
};

export default function DeliverySpeedSection({
  selectedSpeed,
  onChange,
  error,
}: DeliverySpeedSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">
          Delivery Speed
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select your preferred shipping method. Total updates automatically.
        </p>
      </div>

      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((option) => {
          const IconComponent = SPEED_ICONS[option.id] || Truck;
          const isSelected = selectedSpeed === option.id;

          return (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-orange bg-orange-50/20 ring-1 ring-brand-orange/40'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onChange(option.id as ShippingMethod)}
                  className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 shrink-0 cursor-pointer"
                />
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <IconComponent size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{option.title}</p>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
              </div>

              <span className="text-sm font-bold text-gray-900 shrink-0 ml-3">
                {formatINR(option.price)}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-2 font-medium" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
