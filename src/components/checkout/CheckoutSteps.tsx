'use client';

import React from 'react';
import { Check, Truck, CreditCard, FileCheck } from 'lucide-react';

export type CheckoutStepNumber = 1 | 2 | 3;

interface CheckoutStepsProps {
  currentStep: CheckoutStepNumber;
  onStepClick?: (step: CheckoutStepNumber) => void;
  isSubmitting?: boolean;
}

const STEPS = [
  { number: 1 as const, label: 'Shipping', icon: Truck },
  { number: 2 as const, label: 'Payment', icon: CreditCard },
  { number: 3 as const, label: 'Review', icon: FileCheck },
];

export default function CheckoutSteps({
  currentStep,
  onStepClick,
  isSubmitting = false,
}: CheckoutStepsProps) {
  return (
    <nav
      aria-label="Checkout Progress"
      className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm font-semibold w-full max-w-2xl mx-auto"
    >
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const StepIcon = step.icon;

        return (
          <React.Fragment key={step.number}>
            <button
              type="button"
              onClick={() => onStepClick?.(step.number)}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:px-4 rounded-full text-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-brand-orange text-white shadow-sm ring-2 ring-brand-orange/30'
                  : isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? (
                <Check size={16} className="shrink-0 stroke-[2.5]" />
              ) : (
                <StepIcon size={16} className="shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-4 sm:w-8 md:w-12 shrink-0 transition-colors ${
                  step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
