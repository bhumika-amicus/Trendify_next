'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ROUTE ERROR] Captured in ProductDetailError:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-12 sm:px-6 md:px-10">
      <StateMessage
        title="Unable to load product"
        message={error.message || 'The product service is temporarily unavailable.'}
        variant="error"
      >
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
          <Link href="/products">
            <Button variant="primary">Return to Products</Button>
          </Link>
        </div>
      </StateMessage>
    </div>
  );
}
