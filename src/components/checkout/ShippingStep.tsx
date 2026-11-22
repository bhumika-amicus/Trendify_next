'use client';

import React from 'react';
import ContactInfoSection from './ContactInfoSection';
import AddressSection from './AddressSection';
import DeliverySpeedSection from './DeliverySpeedSection';
import type { ShippingAddressFormData } from '@/schemas/checkout';
import type { Address } from '@/types';

interface ShippingStepProps {
  formData: ShippingAddressFormData;
  errors: Partial<Record<keyof ShippingAddressFormData, string>>;
  onFieldChange: (field: keyof ShippingAddressFormData, value: string) => void;
  savedAddresses: Address[];
  selectedAddressId: number | null;
  onAddressSelectionChange: (addressId: number | null) => void;
  onSelectSavedAddress: (address: Address) => void;
  onClearAddressFields: () => void;
  initialCountries?: string[];
  initialStates?: string[];
  initialCities?: string[];
}

export default function ShippingStep({
  formData,
  errors,
  onFieldChange,
  savedAddresses,
  selectedAddressId,
  onAddressSelectionChange,
  onSelectSavedAddress,
  onClearAddressFields,
  initialCountries,
  initialStates,
  initialCities,
}: ShippingStepProps) {
  return (
    <div className="space-y-6">
      {/* 1. Customer Contact Details */}
      <ContactInfoSection
        formData={formData}
        errors={errors}
        onChange={onFieldChange}
      />

      {/* 2. Delivery Address Selection & Form */}
      <AddressSection
        formData={formData}
        errors={errors}
        onChange={onFieldChange}
        savedAddresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        onAddressSelectionChange={onAddressSelectionChange}
        onSelectSavedAddress={onSelectSavedAddress}
        onClearAddressFields={onClearAddressFields}
        initialCountries={initialCountries}
        initialStates={initialStates}
        initialCities={initialCities}
      />

      {/* 3. Delivery Speed Options */}
      <DeliverySpeedSection
        selectedSpeed={formData.shippingMethod}
        onChange={(speed) => onFieldChange('shippingMethod', speed)}
        error={errors.shippingMethod}
      />
    </div>
  );
}
