'use client';

import React from 'react';
import Input from '@/components/common/Input';
import type { ShippingAddressFormData } from '@/schemas/checkout';

interface ContactInfoSectionProps {
  formData: Pick<ShippingAddressFormData, 'fullName' | 'email' | 'phone'>;
  errors: Partial<Record<'fullName' | 'email' | 'phone', string>>;
  onChange: (field: keyof ShippingAddressFormData, value: string) => void;
}

export default function ContactInfoSection({
  formData,
  errors,
  onChange,
}: ContactInfoSectionProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof ShippingAddressFormData, value);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">
          Contact Information
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          We will send order confirmation and shipment tracking updates here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          placeholder="e.g. John Doe"
          required
          value={formData.fullName}
          error={errors.fullName}
          onChange={handleInputChange}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
          value={formData.email}
          error={errors.email}
          onChange={handleInputChange}
        />

        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="+91 9876543210 or 10 digits"
          required
          value={formData.phone}
          error={errors.phone}
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
}
