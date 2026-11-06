'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[APP ERROR] Captured in AppError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center">
      <StateMessage
        title="Something went wrong"
        message="We encountered an unexpected error. Please try again."
        variant="error"
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </StateMessage>
    </div>
  );
}
