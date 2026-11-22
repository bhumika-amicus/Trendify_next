'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CartItem, Address } from '@/types';
import type { PaymentMethod } from '@/schemas/checkout';
import { placeOrderAction } from '@/actions/order';
import { useCartActions } from '@/context/CartContext';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import CheckoutSteps, { type CheckoutStepNumber } from './CheckoutSteps';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';

interface CheckoutViewProps {
  initialItems: CartItem[];
  initialAddresses: Address[];
  initialCountries: string[];
  initialStates?: string[];
  initialCities?: string[];
}

export default function CheckoutView({
  initialItems,
  initialAddresses,
  initialCountries,
  initialStates = [],
  initialCities = [],
}: CheckoutViewProps) {
  const router = useRouter();
  const { resetCart } = useCartActions();
  const [currentStep, setCurrentStep] = useState<CheckoutStepNumber>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  //Checks if the user has an address flagged with isDefault: true. If not, it falls back to the first address in the array, or null if the user is a new customer.
  const defaultAddr =
    initialAddresses.find((a) => a.isDefault) || initialAddresses[0] || null;

  // Selected address ID to pass to order action; null if user enters a new/custom address
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    defaultAddr?.addressId ?? null
  );

  // Form state, live dynamic summary calculations, and Zod validation
  const {
    formData,
    errors,
    summary,
    handleFieldChange,
    setAddressFromSaved,
    clearAddressFields,
    validate,
  } = useCheckoutForm({
    initialItems,
    defaultAddress: defaultAddr,
  });

  const handleStepClick = (targetStep: CheckoutStepNumber) => {
    if (targetStep === currentStep) return;

    // Rule 1: Backward navigation is ALWAYS allowed (zero validation needed)
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    // Rule 2: Moving forward from Step 1 requires full Zod validation
    if (currentStep === 1) {
      if (validate()) {
        setCurrentStep(targetStep);
      } else {
        toast.error('Please complete all required shipping fields before proceeding.');
      }
      return;
    }
    // Rule 3: Moving from Step 2 to Step 3 is unrestricted (Payment default is already 'cod')
    if (currentStep === 2) {
      setCurrentStep(targetStep);
    }
  };

  const handleContinueToPayment = () => {
    if (validate()) {
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
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
        selectedAddressId,
      });

      if (!res.success) {
        // Case A: Session Expired Mid-Checkout
        if (res.requireAuth) {
          toast.error('Please log in to complete your checkout.', { id: toastId });
          router.push('/login?callbackUrl=/checkout');
          return;
        }
        //Case B: Validation Errors Mid-Checkout (e.g., stock issues or address validation failure)
        toast.error(res.error || 'Failed to place order.', { id: toastId });
        const errorLower = res.error?.toLowerCase() || '';
        if (errorLower.includes('address') || errorLower.includes('stock')) {
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Navbar Cart Badge update: Instant empty state
      resetCart();

      toast.success('Order placed successfully!', { id: toastId, duration: 4000 });
      const targetUrl = res.orderId ? `/orders?orderId=${res.orderId}` : '/orders';
      router.push(targetUrl);
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
                onFieldChange={handleFieldChange}
                savedAddresses={initialAddresses}
                selectedAddressId={selectedAddressId}
                onAddressSelectionChange={setSelectedAddressId}
                onSelectSavedAddress={setAddressFromSaved}
                onClearAddressFields={clearAddressFields}
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
