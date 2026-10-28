'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ROUTE ERROR] Captured in StoreError boundary:', error);
  }, [error]);

  return (
    <div className="w-full py-8">
      <StateMessage
        title="Unable to load products"
        message={
          error.message ||
          'Our catalog service is currently experiencing technical difficulties. Please try again.'
        }
        variant="error"
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
          <Link href="/products">
            <Button variant="primary">Reset All Filters</Button>
          </Link>
        </div>
      </StateMessage>
    </div>
  );
}
