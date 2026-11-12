'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function StoreError({
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
      logLabel="[ROUTE ERROR] Captured in StoreError boundary:"
      title="Unable to load products"
      message="Our catalog service is currently experiencing technical difficulties. Please try again."
      secondaryHref="/products"
      secondaryLabel="Reset All Filters"
      className="w-full py-8"
    />
  );
}
