'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CART ERROR] Captured in CartError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-4xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center">
      <StateMessage
        title="Unable to Load Your Cart"
        message={
          error.message ||
          'We encountered an issue retrieving your shopping cart. Please try again or continue browsing our store.'
        }
        variant="error"
        buttonText="Try Again"
        onAction={reset}
      >
        <div className="mt-2">
          <Button href="/products" variant="ghost" size="sm">
            Browse Products
          </Button>
        </div>
      </StateMessage>
    </div>
  );
}
