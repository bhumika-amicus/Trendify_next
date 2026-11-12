'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function CheckoutError({
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
      logLabel="[CHECKOUT ERROR] Captured in CheckoutError boundary:"
      title="Unable to Load Checkout"
      message="We were unable to prepare your checkout session. Your cart items are safe. Please try refreshing or return to your cart."
      secondaryHref="/cart"
      secondaryLabel="Return to Cart"
      className="mx-auto min-h-[55vh] w-full max-w-4xl px-4 py-16 sm:px-6 md:px-8 flex items-center justify-center"
    />
  );
}
