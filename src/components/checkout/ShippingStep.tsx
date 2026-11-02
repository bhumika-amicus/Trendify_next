'use client';

import React, { useEffect } from 'react';
import {
  Truck,
  Zap,
  Clock,
  Plus,
  MapPin,
  X,
  Pencil,
} from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import AddressCard from './AddressCard';
import {
  SHIPPING_OPTIONS,
  type ShippingAddressFormData,
  type ShippingMethod,
} from '@/schemas/checkout';
import type { AddressDto } from '@/types';
import type { StateOption } from '@/services/locationService';
import { useLocationCascade } from '@/hooks/useLocationCascade';
import { formatINR } from '@/utils/formatters';

interface ShippingStepProps {
  formData: ShippingAddressFormData;
  errors: Partial<Record<keyof ShippingAddressFormData, string>>;
  onChange: (field: keyof ShippingAddressFormData, value: string) => void;
  // Saved addresses management
  savedAddresses: AddressDto[];
  selectedAddressId: number | null;
  onSelectAddress: (address: AddressDto) => void;
  onEditAddress?: (address: AddressDto) => void;
  isAddingNewAddress: boolean;
  formMode?: 'create' | 'edit';
  onToggleAddNewAddress: (addingNew: boolean) => void;
  onDeleteAddress?: (addressId: number) => void;
  initialCountries?: string[];
  initialStates?: StateOption[];
  initialCities?: string[];
}

const SPEED_ICONS = {
  standard: Truck,
  express: Zap,
  overnight: Clock,
};

export default function ShippingStep({
  formData,
  errors,
  onChange,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  isAddingNewAddress,
  formMode = 'create',
  onToggleAddNewAddress,
  onDeleteAddress,
  initialCountries = [],
  initialStates = [],
  initialCities = [],
}: ShippingStepProps) {
  const {
    countries,
    states,
    cities,
    loading,
    loadStatesForCountry,
    loadCitiesForState,
    resetLocations,
  } = useLocationCascade({
    initialCountries,
    initialStates,
    initialCities,
  });

  // Pre-load states and cities if country is pre-populated (e.g. from saved address)
  useEffect(() => {
    if (formData.country && states.length === 0) {
      void loadStatesForCountry(formData.country);
    }
    if (formData.country && formData.state && cities.length === 0) {
      void loadCitiesForState(formData.country, formData.state);
    }
  }, [
    formData.country,
    formData.state,
    states.length,
    cities.length,
    loadStatesForCountry,
    loadCitiesForState,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof ShippingAddressFormData, value);

    if (name === 'country') {
      void loadStatesForCountry(value);
    } else if (name === 'state') {
      void loadCitiesForState(formData.country, value);
    }
  };

  const handleSelect = (addr: AddressDto) => {
    onSelectAddress(addr);
    void loadStatesForCountry(addr.country);
    void loadCitiesForState(addr.country, addr.state);
  };

  const handleToggleAddNew = (addingNew: boolean) => {
    onToggleAddNewAddress(addingNew);
    if (addingNew) {
      resetLocations();
    }
  };

  const hasSavedAddresses = savedAddresses.length > 0;
  const showAddressForm = !hasSavedAddresses || isAddingNewAddress;

  return (
    <div className="space-y-8">
      {/* 1. Contact Information Section */}
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

      {/* 2. Saved Addresses Grid (If User Has Saved Addresses) */}
      {hasSavedAddresses && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                <MapPin size={18} className="text-brand-orange" />
                <span>Saved Addresses</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose a saved delivery address or enter a new one.
              </p>
            </div>

            {!isAddingNewAddress ? (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleToggleAddNew(true)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Plus size={14} />
                <span>Add New Address</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => handleToggleAddNew(false)}
                className="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <X size={14} />
                <span>Use Saved Address</span>
              </Button>
            )}
          </div>

          {!isAddingNewAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <AddressCard
                  key={addr.addressId}
                  address={addr}
                  isSelected={selectedAddressId === addr.addressId}
                  onSelect={handleSelect}
                  onEdit={() => {
                    if (onEditAddress) {
                      onEditAddress(addr);
                    } else {
                      handleSelect(addr);
                      handleToggleAddNew(true);
                    }
                  }}
                  onDelete={onDeleteAddress}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Address Form (Cascading Country -> State -> City) */}
      {showAddressForm && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">
                {formMode === 'edit'
                  ? 'Edit Shipping Address'
                  : hasSavedAddresses
                    ? 'New Shipping Address'
                    : 'Shipping Address'}
              </h2>
              {formMode === 'edit' && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <Pencil size={11} />
                  <span>Editing Address</span>
                </span>
              )}
              {formMode === 'create' && hasSavedAddresses && (
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                  <Plus size={11} />
                  <span>New Address</span>
                </span>
              )}
            </div>

            {hasSavedAddresses && (
              <button
                type="button"
                onClick={() => onToggleAddNewAddress(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="address"
                name="address"
                label="Street Address"
                placeholder="House/Flat number, Street name"
                required
                value={formData.address}
                error={errors.address}
                onChange={handleInputChange}
              />

              <Input
                id="apartment"
                name="apartment"
                label="Apartment, suite, unit (optional)"
                placeholder="Apartment, Landmark, Floor"
                value={formData.apartment || ''}
                error={errors.apartment}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country Dropdown */}
              <Select
                id="country"
                name="country"
                label="Country"
                required
                value={formData.country}
                onChange={handleInputChange}
                options={countries}
                isLoading={loading.countries}
                loadingText="Loading countries..."
                placeholder="Select Country"
                error={errors.country}
              />

              {/* State Dropdown */}
              <Select
                id="state"
                name="state"
                label="State / Region"
                required
                value={formData.state}
                onChange={handleInputChange}
                options={states.map((s) => ({ value: s.name, label: s.name }))}
                isLoading={loading.states}
                loadingText="Loading states..."
                disabled={!formData.country}
                disabledText="Select a country first"
                placeholder={states.length > 0 ? 'Select State' : 'No states found'}
                error={errors.state}
              />

              {/* City Dropdown */}
              <Select
                id="city"
                name="city"
                label="City"
                required
                value={formData.city}
                onChange={handleInputChange}
                options={cities}
                isLoading={loading.cities}
                loadingText="Loading cities..."
                disabled={!formData.state}
                disabledText="Select a state first"
                placeholder={cities.length > 0 ? 'Select City' : 'No cities found'}
                error={errors.city}
              />

              {/* Postal Code */}
              <Input
                id="postalCode"
                name="postalCode"
                label="PIN / Postal Code"
                placeholder="e.g. 400001 or 90210"
                required
                maxLength={10}
                value={formData.postalCode}
                error={errors.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Delivery Speed Selection Section */}
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
            const isSelected = formData.shippingMethod === option.id;

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
                    onChange={() => onChange('shippingMethod', option.id as ShippingMethod)}
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

        {errors.shippingMethod && (
          <p className="text-red-600 text-xs mt-2 font-medium">
            {errors.shippingMethod}
          </p>
        )}
      </section>
    </div>
  );
}
