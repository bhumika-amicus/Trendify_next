'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function CartError({
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
      logLabel="[CART ERROR] Captured in CartError boundary:"
      title="Unable to Load Your Cart"
      message="We encountered an issue retrieving your shopping cart. Please try again or continue browsing our store."
      secondaryHref="/products"
      secondaryLabel="Browse Products"
    />
  );
}
