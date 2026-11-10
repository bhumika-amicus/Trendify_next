'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DASHBOARD ERROR] Captured in DashboardError boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-4xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center">
      <StateMessage
        title="Unable to Load Dashboard"
        message="We encountered an issue displaying your account details. Please try again or return home."
        variant="error"
        buttonText="Try Again"
        onAction={reset}
      >
        <div className="mt-2">
          <Button href="/" variant="ghost" size="sm">
            Back to Home
          </Button>
        </div>
      </StateMessage>
    </div>
  );
}

