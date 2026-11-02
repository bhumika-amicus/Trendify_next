'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CartItem, AddressDto } from '@/types';
import type { UserSession } from '@/lib/session';
import { placeOrderAction } from '@/actions/order';
import { emitCartUpdate } from '@/utils/cartEvents';
import { calculateCheckoutSummary } from '@/utils/cartCalculations';
import CheckoutSteps, { type CheckoutStepNumber } from './CheckoutSteps';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import {
  ShippingAddressSchema,
  SHIPPING_RATES,
  type ShippingAddressFormData,
  type PaymentMethod,
} from '@/schemas/checkout';
import type { StateOption } from '@/services/locationService';

interface CheckoutViewProps {
  initialItems: CartItem[];
  initialUser: UserSession | null;
  initialAddresses: AddressDto[];
  initialCountries: string[];
  initialStates?: StateOption[];
  initialCities?: string[];
}

export default function CheckoutView({
  initialItems,
  initialUser,
  initialAddresses,
  initialCountries,
  initialStates = [],
  initialCities = [],
}: CheckoutViewProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStepNumber>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Saved Addresses
  const savedAddresses = initialAddresses;
  const defaultAddr =
    initialAddresses.find((a) => a.isDefault) || initialAddresses[0] || null;

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    defaultAddr?.addressId ?? null
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(
    initialAddresses.length === 0
  );
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Form State: Pre-populated if saved address exists, otherwise clean
  const [formData, setFormData] = useState<ShippingAddressFormData>({
    fullName: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: '',
    address: defaultAddr?.addressLine1 || '',
    apartment: defaultAddr?.addressLine2 || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || '',
    shippingMethod: 'standard',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddressFormData, string>>>({});

  // Dynamic Live Order Calculations
  const summary = useMemo(
    () =>
      calculateCheckoutSummary(
        initialItems,
        SHIPPING_RATES[formData.shippingMethod] ?? 100
      ),
    [initialItems, formData.shippingMethod]
  );

  const handleFieldChange = (
    field: keyof ShippingAddressFormData,
    value: string
  ) => {
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

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectAddress = useCallback((addr: AddressDto) => {
    setSelectedAddressId(addr.addressId);
    setFormData((prev) => ({
      ...prev,
      address: addr.addressLine1,
      apartment: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));
    setIsAddingNewAddress(false);
  }, []);

  const handleEditAddress = (addr: AddressDto) => {
    handleSelectAddress(addr);
    setFormMode('edit');
    setIsAddingNewAddress(true);
  };

  const handleToggleAddNewAddress = (addingNew: boolean) => {
    setIsAddingNewAddress(addingNew);
    if (addingNew) {
      setFormMode('create');
      setSelectedAddressId(null);
      setFormData((prev) => ({
        ...prev,
        address: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      }));
    } else if (defaultAddr) {
      handleSelectAddress(defaultAddr);
    }
  };

  const validateShippingForm = (): boolean => {
    const result = ShippingAddressSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShippingAddressFormData, string>> = {};
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
  };

  const handleStepClick = (targetStep: CheckoutStepNumber) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    if (currentStep === 1) {
      if (validateShippingForm()) {
        setCurrentStep(targetStep);
      } else {
        toast.error('Please complete all required shipping fields before proceeding.');
      }
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(targetStep);
    }
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please correct errors in the shipping form to continue.');
    }
  };

  const handleContinueToReview = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const router = useRouter();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateShippingForm()) {
      setCurrentStep(1);
      toast.error('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Placing your order securely...');

    try {
      const res = await placeOrderAction({
        ...formData,
        paymentMethod,
        selectedAddressId: isAddingNewAddress ? null : selectedAddressId,
      });

      if (!res.success) {
        if (res.requireAuth) {
          toast.error('Please log in to complete your checkout.', { id: toastId });
          router.push('/login?callbackUrl=/checkout');
          return;
        }
        toast.error(res.error || 'Failed to place order.', { id: toastId });

        const errorLower = res.error?.toLowerCase() || '';
        if (errorLower.includes('address') || errorLower.includes('stock')) {
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // 0ms Badge Update: Cart is now empty!
      emitCartUpdate(0);

      toast.success('Order placed successfully!', { id: toastId, duration: 4000 });
      router.push('/orders');
    } catch (err) {
      console.error('Failed to submit order:', err);
      toast.error('Something went wrong while placing your order. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your purchase securely. Enter shipping address, choose delivery speed, and finalize your order.
        </p>
      </div>

      {/* 1. Step Navigation Indicators */}
      <CheckoutSteps
        currentStep={currentStep}
        onStepClick={handleStepClick}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmitOrder} noValidate>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] xl:gap-8">
          {/* 2. Active Step Content Area */}
          <div className="min-w-0">
            {currentStep === 1 && (
              <ShippingStep
                formData={formData}
                errors={errors}
                onChange={handleFieldChange}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onEditAddress={handleEditAddress}
                isAddingNewAddress={isAddingNewAddress}
                formMode={formMode}
                onToggleAddNewAddress={handleToggleAddNewAddress}
                initialCountries={initialCountries}
                initialStates={initialStates}
                initialCities={initialCities}
              />
            )}

            {currentStep === 2 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            )}

            {currentStep === 3 && (
              <ReviewStep
                formData={formData}
                paymentMethod={paymentMethod}
                onEditStep={setCurrentStep}
              />
            )}
          </div>

          {/* 3. Dynamic Sticky Order Summary */}
          <CheckoutOrderSummary
            items={initialItems}
            summary={summary}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onContinue={
              currentStep === 1
                ? handleContinueToPayment
                : currentStep === 2
                  ? handleContinueToReview
                  : undefined
            }
          />
        </div>
      </form>
    </div>
  );
}

