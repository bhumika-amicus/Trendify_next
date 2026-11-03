'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Plus, X, Pencil } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import AddressCard from './AddressCard';
import type { ShippingAddressFormData } from '@/schemas/checkout';
import type { AddressDto } from '@/types';
import type { StateOption } from '@/services/locationService';
import { useLocationCascade } from '@/hooks/useLocationCascade';

interface AddressSectionProps {
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

export default function AddressSection({
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
  initialCountries = [],
  initialStates = [],
  initialCities = [],
}: AddressSectionProps) {
  const {
    countries,
    states,
    cities,
    loading,
    error: locationError,
    loadStatesForCountry,
    loadCitiesForState,
    loadAddressLocations,
    resetLocations,
  } = useLocationCascade({
    initialCountries,
    initialStates,
    initialCities,
  });

  // Lazy-load locations on mount ONLY if the user has NO saved addresses
  const hasInitializedRef = useRef(false);
  const hasSavedAddresses = savedAddresses.length > 0;
  const showAddressForm = !hasSavedAddresses || isAddingNewAddress;

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Only eager-fetch if there are no saved addresses and the form is shown on mount
    if (!hasSavedAddresses && formData.country) {
      void loadAddressLocations(formData.country, formData.state);
    }
  }, [hasSavedAddresses, formData.country, formData.state, loadAddressLocations]);

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
  };

  // Event-driven edit: load states and cities atomically when the user clicks 'Edit'
  const handleEdit = (addr: AddressDto) => {
    if (onEditAddress) {
      onEditAddress(addr);
    } else {
      onSelectAddress(addr);
      onToggleAddNewAddress(true);
    }

    if (addr.country) {
      void loadAddressLocations(addr.country, addr.state);
    }
  };

  const handleToggleAddNew = (addingNew: boolean) => {
    onToggleAddNewAddress(addingNew);
    resetLocations();
  };

  return (
    <div className="space-y-6">
      {/* 1. Saved Addresses Grid (If User Has Saved Addresses) */}
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
                <span>Cancel New Address</span>
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
                  onEdit={() => handleEdit(addr)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. Dynamic Address Form (Cascading Country -> State -> City) */}
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
                onClick={() => handleToggleAddNew(false)}
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
                placeholder={
                  locationError.countries
                    ? 'Failed to load countries'
                    : 'Select Country'
                }
                error={errors.country || locationError.countries || undefined}
              />

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
                placeholder={
                  locationError.states
                    ? 'Failed to load states'
                    : states.length > 0
                      ? 'Select State'
                      : 'No states found'
                }
                error={errors.state || locationError.states || undefined}
              />

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
                placeholder={
                  locationError.cities
                    ? 'Failed to load cities'
                    : cities.length > 0
                      ? 'Select City'
                      : 'No cities found'
                }
                error={errors.city || locationError.cities || undefined}
              />

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
    </div>
  );
}
