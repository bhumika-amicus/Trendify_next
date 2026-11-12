'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      logLabel="[APP ERROR] Captured in AppError boundary:"
      title="Something went wrong"
      message="We encountered an unexpected error. Please try again."
      secondaryHref="/"
      secondaryLabel="Back to Home"
      className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-16 sm:px-6 md:px-10 flex items-center justify-center"
    />
  );
}
