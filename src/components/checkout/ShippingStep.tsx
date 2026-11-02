'use client';

import React from 'react';
import {
  Truck,
  Zap,
  Clock,
  Plus,
  MapPin,
  X,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import AddressCard from './AddressCard';
import {
  SHIPPING_OPTIONS,
  type ShippingAddressFormData,
  type ShippingMethod,
} from '@/schemas/checkout';
import type { AddressDto } from '@/types';
import type { StateOption } from '@/services/locationService';
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
  // Cascading location data
  countries: string[];
  states: StateOption[];
  cities: string[];
  isLoadingCountries?: boolean;
  isLoadingStates: boolean;
  isLoadingCities: boolean;
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
  countries,
  states,
  cities,
  isLoadingCountries = false,
  isLoadingStates,
  isLoadingCities,
}: ShippingStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof ShippingAddressFormData, value);
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
                onClick={() => onToggleAddNewAddress(true)}
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
                onClick={() => onToggleAddNewAddress(false)}
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
                  onSelect={onSelectAddress}
                  onEdit={() => {
                    if (onEditAddress) {
                      onEditAddress(addr);
                    } else {
                      onSelectAddress(addr);
                      onToggleAddNewAddress(true);
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
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Country <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={isLoadingCountries}
                    className={`block w-full appearance-none rounded-md border bg-white py-2.5 pl-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                      errors.country ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {isLoadingCountries ? 'Loading countries...' : 'Select Country'}
                    </option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600">{errors.country}</p>
                )}
              </div>

              {/* State Dropdown */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  State / Region <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={isLoadingStates || !formData.country}
                    className={`block w-full appearance-none rounded-md border py-2.5 pl-3 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange ${
                      isLoadingStates || !formData.country
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                        : 'bg-white'
                    } ${errors.state ? 'border-red-400 bg-red-50/20' : 'border-gray-300'}`}
                  >
                    <option value="">
                      {isLoadingStates
                        ? 'Loading states...'
                        : !formData.country
                          ? 'Select a country first'
                          : states.length > 0
                            ? 'Select State'
                            : 'No states found'}
                    </option>
                    {states.map((s) => (
                      <option key={`${s.name}-${s.state_code}`} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.state && (
                  <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                )}
              </div>

              {/* City Dropdown */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  City <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isLoadingCities || !formData.state}
                    className={`block w-full appearance-none rounded-md border py-2.5 pl-3 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange ${
                      isLoadingCities || !formData.state
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                        : 'bg-white'
                    } ${errors.city ? 'border-red-400 bg-red-50/20' : 'border-gray-300'}`}
                  >
                    <option value="">
                      {isLoadingCities
                        ? 'Loading cities...'
                        : !formData.state
                          ? 'Select a state first'
                          : cities.length > 0
                            ? 'Select City'
                            : 'No cities found'}
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>

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
