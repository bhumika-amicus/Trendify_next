'use client';

import { useState, useMemo, useCallback } from 'react';
import type { CartItem, AddressDto } from '@/types';
import {
  ShippingAddressSchema,
  SHIPPING_RATES,
  type ShippingAddressFormData,
} from '@/schemas/checkout';
import { calculateCheckoutSummary } from '@/utils/cartCalculations';

export interface UseCheckoutFormProps {
  initialItems: CartItem[];
  defaultAddress: AddressDto | null;
}

export function useCheckoutForm({
  initialItems,
  defaultAddress,
}: UseCheckoutFormProps) {
  const [formData, setFormData] = useState<ShippingAddressFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: defaultAddress?.addressLine1 || '',
    apartment: defaultAddress?.addressLine2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    postalCode: defaultAddress?.postalCode || '',
    country: defaultAddress?.country || 'India',
    shippingMethod: 'standard',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddressFormData, string>>
  >({});

  // Memoized dynamic calculation: only recalculates when items or shippingMethod change
  const summary = useMemo(
    () =>
      calculateCheckoutSummary(
        initialItems,
        SHIPPING_RATES[formData.shippingMethod] ?? 100
      ),
    [initialItems, formData.shippingMethod]
  );

  // Field change handler with cascading resets for dependent geographic fields
  const handleFieldChange = useCallback(
    (field: keyof ShippingAddressFormData, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        if (field === 'country') {
          next.state = '';
          next.city = '';
        } else if (field === 'state') {
          next.city = '';
        }
        return next;
      });

      // Clear the error for this field as soon as user types
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  // Atomically populate address fields when a saved address card is selected
  const setAddressFromSaved = useCallback((addr: AddressDto) => {
    setFormData((prev) => ({
      ...prev,
      address: addr.addressLine1,
      apartment: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));

    // Clear any existing address validation errors
    setErrors((prev) => {
      const next = { ...prev };
      delete next.address;
      delete next.apartment;
      delete next.city;
      delete next.state;
      delete next.postalCode;
      delete next.country;
      return next;
    });
  }, []);

  // Clear address fields when creating a brand-new address, keeping contact info intact
  const clearAddressFields = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      address: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    }));
  }, []);

  // Zod-based validation returning a boolean and populating typed error messages
  const validate = useCallback((): boolean => {
    const result = ShippingAddressSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShippingAddressFormData, string>> =
        {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ShippingAddressFormData;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [formData]);

  return {
    formData,
    errors,
    summary,
    handleFieldChange,
    setAddressFromSaved,
    clearAddressFields,
    validate,
  };
}
