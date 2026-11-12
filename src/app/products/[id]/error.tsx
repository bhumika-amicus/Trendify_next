'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function ProductDetailError({
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
      logLabel="[ROUTE ERROR] Captured in ProductDetailError:"
      title="Unable to load product"
      message="We encountered an issue retrieving this product. Please try again or explore other items."
      secondaryHref="/products"
      secondaryLabel="Return to Products"
      className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-12 sm:px-6 md:px-10"
    />
  );
}
