'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ORDERS ERROR] Captured in OrdersError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-4xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center">
      <StateMessage
        title="Unable to Load Your Orders"
        message="We encountered an issue retrieving your order history. Please try again or return to the shop."
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

