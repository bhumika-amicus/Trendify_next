'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function OrdersError({
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
      logLabel="[ORDERS ERROR] Captured in OrdersError boundary:"
      title="Unable to Load Your Orders"
      message="We encountered an issue retrieving your order history. Please try again or return to the shop."
      secondaryHref="/products"
      secondaryLabel="Browse Products"
    />
  );
}
