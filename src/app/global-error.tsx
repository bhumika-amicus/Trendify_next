
'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GLOBAL ERROR] Captured in GlobalError boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white text-text-body font-sans">
        <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 md:px-10">
          <StateMessage
            title="Something went wrong"
            message="An unexpected application error occurred. Please try again or return to the homepage."
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
        </main>
      </body>
    </html>
  );
}
