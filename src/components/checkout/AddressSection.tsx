'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import Button from '@/components/common/Button';
import AddressCard from './AddressCard';
import AddressFormFields from './AddressFormFields';
import type { ShippingAddressFormData } from '@/schemas/checkout';
import type { Address } from '@/types';
import type { StateOption } from '@/services/locationService';
import { useLocationCascade } from '@/hooks/useLocationCascade';

interface AddressSectionProps {
  formData: ShippingAddressFormData;
  errors: Partial<Record<keyof ShippingAddressFormData, string>>;
  onChange: (field: keyof ShippingAddressFormData, value: string) => void;
  savedAddresses: Address[];
  onAddressSelectionChange: (addressId: number | null) => void;
  onSelectSavedAddress: (address: Address) => void;
  onClearAddressFields: () => void;
  initialCountries?: string[];
  initialStates?: StateOption[];
  initialCities?: string[];
}

export default function AddressSection({
  formData,
  errors,
  onChange,
  savedAddresses,
  onAddressSelectionChange,
  onSelectSavedAddress,
  onClearAddressFields,
  initialCountries = [],
  initialStates = [],
  initialCities = [],
}: AddressSectionProps) {
  const hasSavedAddresses = savedAddresses.length > 0;
  const defaultAddr =
    savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;

  // Local UI presentation state: whether we show saved cards or the address form
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(
    !hasSavedAddresses
  );
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    defaultAddr?.addressId ?? null
  );

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
  const showAddressForm = !hasSavedAddresses || isAddingNewAddress;

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

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

  const handleSelect = (addr: Address) => {
    setSelectedAddressId(addr.addressId);
    setIsAddingNewAddress(false);
    onAddressSelectionChange(addr.addressId);
    onSelectSavedAddress(addr);
  };

  const handleEdit = (addr: Address) => {
    setSelectedAddressId(addr.addressId);
    setFormMode('edit');
    setIsAddingNewAddress(true);
    // When editing, send null as selectedAddressId so backend saves updated address as new or updated
    onAddressSelectionChange(null);
    onSelectSavedAddress(addr);

    if (addr.country) {
      void loadAddressLocations(addr.country, addr.state);
    }
  };

  const handleToggleAddNew = (addingNew: boolean) => {
    setIsAddingNewAddress(addingNew);

    if (addingNew) {
      setFormMode('create');
      setSelectedAddressId(null);
      onAddressSelectionChange(null);
      onClearAddressFields();
      resetLocations();
    } else if (defaultAddr) {
      setSelectedAddressId(defaultAddr.addressId);
      onAddressSelectionChange(defaultAddr.addressId);
      onSelectSavedAddress(defaultAddr);
    }
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
        <AddressFormFields
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          formMode={formMode}
          hasSavedAddresses={hasSavedAddresses}
          onCancel={() => handleToggleAddNew(false)}
          countries={countries}
          states={states}
          cities={cities}
          loading={loading}
          locationError={locationError}
        />
      )}
    </div>
  );
}
