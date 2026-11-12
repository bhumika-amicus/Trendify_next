'use client'; // Next.js requires route error boundaries to be Client Components.

import RouteErrorFallback from '@/components/common/RouteErrorFallback';

export default function DashboardError({
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
      logLabel="[DASHBOARD ERROR] Captured in DashboardError boundary:"
      title="Unable to Load Dashboard"
      message="We encountered an issue displaying your account details. Please try again or return home."
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
