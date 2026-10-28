'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GLOBAL ERROR] Captured in GlobalError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center">
      <StateMessage
        title="Something went wrong"
        message={
          error.message ||
          'Our service is temporarily unavailable. Please try again or return to the homepage.'
        }
        variant="error"
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </StateMessage>
    </div>
  );
}
