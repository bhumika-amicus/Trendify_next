'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

export interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  message: string;
  secondaryHref: string;
  secondaryLabel: string;
  logLabel: string;
  className?: string;
}

/**
 * Shared client fallback for route-level `error.tsx` boundaries.
 * Pairs `router.refresh()` with `reset()` inside `startTransition` so retrying
 * re-executes failed Server Components on the server instead of replaying the cached error.
 */
export default function RouteErrorFallback({
  error,
  reset,
  title,
  message,
  secondaryHref,
  secondaryLabel,
  logLabel,
  className = 'mx-auto flex min-h-[55vh] w-full max-w-4xl items-center justify-center px-4 py-16 sm:px-6 md:px-10',
}: RouteErrorFallbackProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(`${logLabel}`, error);
  }, [error, logLabel]);

  const handleRetry = () => {
    // `reset()` alone only clears React's client ErrorBoundary state and would
    // re-render the cached Server Component failure. `router.refresh()` asks the
    // server to re-run the route, and `startTransition` waits for the fresh
    // server payload before clearing the error screen.
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className={className}>
      <StateMessage title={title} message={message} variant="error">
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" isLoading={isPending} onClick={handleRetry}>
            Try Again
          </Button>
          <Button href={secondaryHref} variant="primary">
            {secondaryLabel}
          </Button>
        </div>
      </StateMessage>
    </div>
  );
}

