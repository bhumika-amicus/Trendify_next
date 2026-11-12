import OrderCardSkeleton from '@/components/orders/OrderCardSkeleton';

export default function OrdersLoading() {
  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs skeleton */}
      <div className="mb-4 flex items-center gap-2 animate-pulse">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>

      {/* Page Header skeleton */}
      <div className="mb-6 space-y-2 animate-pulse">
        <div className="h-8 w-44 rounded bg-gray-200" />
        <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
      </div>

      {/* Filter Tabs skeleton */}
      <div className="flex flex-wrap gap-2 mb-6 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Order Cards Skeleton */}
      <div className="space-y-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}

