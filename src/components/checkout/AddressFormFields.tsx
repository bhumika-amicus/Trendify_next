'use client';

import React from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import type { ShippingAddressFormData } from '@/schemas/checkout';
import type { StateOption } from '@/services/locationService';

export interface AddressFormFieldsProps {
  formData: ShippingAddressFormData;
  errors: Partial<Record<keyof ShippingAddressFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formMode: 'create' | 'edit';
  hasSavedAddresses: boolean;
  onCancel: () => void;
  countries: string[];
  states: StateOption[];
  cities: string[];
  loading: { countries: boolean; states: boolean; cities: boolean };
  locationError: { countries: string | null; states: string | null; cities: string | null };
}

export default function AddressFormFields({
  formData,
  errors,
  onChange,
  formMode,
  hasSavedAddresses,
  onCancel,
  countries,
  states,
  cities,
  loading,
  locationError,
}: AddressFormFieldsProps) {
  return (
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
            onClick={onCancel}
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
            onChange={onChange}
          />

          <Input
            id="apartment"
            name="apartment"
            label="Apartment, suite, unit (optional)"
            placeholder="Apartment, Landmark, Floor"
            value={formData.apartment || ''}
            error={errors.apartment}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            id="country"
            name="country"
            label="Country"
            required
            value={formData.country}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>
      </div>
    </section>
  );
}

