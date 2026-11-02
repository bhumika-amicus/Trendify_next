'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CHECKOUT ERROR] Captured in CheckoutError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-4xl px-4 py-16 sm:px-6 md:px-8 flex items-center justify-center">
      <StateMessage
        title="Unable to Load Checkout"
        message={
          error.message ||
          'We were unable to prepare your checkout session. Your cart items are safe. Please try refreshing or return to your cart.'
        }
        variant="error"
        buttonText="Try Again"
        onAction={reset}
      >
        <div className="mt-2">
          <Button href="/cart" variant="ghost" size="sm">
            Return to Cart
          </Button>
        </div>
      </StateMessage>
    </div>
  );
}

