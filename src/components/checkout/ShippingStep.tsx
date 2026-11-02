'use client';

import React from 'react';
import ContactInfoSection from './ContactInfoSection';
import AddressSection from './AddressSection';
import DeliverySpeedSection from './DeliverySpeedSection';
import type { ShippingAddressFormData } from '@/schemas/checkout';
import type { AddressDto } from '@/types';
import type { StateOption } from '@/services/locationService';

interface ShippingStepProps {
  formData: ShippingAddressFormData;
  errors: Partial<Record<keyof ShippingAddressFormData, string>>;
  onChange: (field: keyof ShippingAddressFormData, value: string) => void;
  savedAddresses: AddressDto[];
  selectedAddressId: number | null;
  onSelectAddress: (address: AddressDto) => void;
  onEditAddress?: (address: AddressDto) => void;
  isAddingNewAddress: boolean;
  formMode?: 'create' | 'edit';
  onToggleAddNewAddress: (addingNew: boolean) => void;
  initialCountries?: string[];
  initialStates?: StateOption[];
  initialCities?: string[];
}

export default function ShippingStep({
  formData,
  errors,
  onChange,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  isAddingNewAddress,
  formMode,
  onToggleAddNewAddress,
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
        onChange={onChange}
      />

      {/* 2. Delivery Address Selection & Form */}
      <AddressSection
        formData={formData}
        errors={errors}
        onChange={onChange}
        savedAddresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={onSelectAddress}
        onEditAddress={onEditAddress}
        isAddingNewAddress={isAddingNewAddress}
        formMode={formMode}
        onToggleAddNewAddress={onToggleAddNewAddress}
        initialCountries={initialCountries}
        initialStates={initialStates}
        initialCities={initialCities}
      />

      {/* 3. Delivery Speed Options */}
      <DeliverySpeedSection
        selectedSpeed={formData.shippingMethod}
        onChange={(speed) => onChange('shippingMethod', speed)}
        error={errors.shippingMethod}
      />
    </div>
  );
}
