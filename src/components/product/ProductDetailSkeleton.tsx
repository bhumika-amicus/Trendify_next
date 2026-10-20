import Card from '@/components/common/Card';

export default function ProductDetailSkeleton() {
  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
      </div>

      <Card variant="elevated" className="mt-6 p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Image Box Skeleton */}
          <div className="flex flex-1 items-center justify-center rounded border border-gray-100 bg-surface-muted p-8 md:p-12 min-h-80 md:min-h-100">
            <div className="h-56 w-56 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Category tag */}
            <div className="mb-3 h-4 w-24 rounded bg-gray-200 animate-pulse" />

            {/* Title */}
            <div className="mb-3 h-9 w-3/4 rounded bg-gray-200 animate-pulse" />

            {/* Brand */}
            <div className="mb-4 h-4 w-32 rounded bg-gray-200 animate-pulse" />

            {/* Rating */}
            <div className="mb-6 h-5 w-40 rounded bg-gray-200 animate-pulse" />

            {/* Price */}
            <div className="mb-6 h-8 w-28 rounded bg-gray-200 animate-pulse" />

            <hr className="mb-6 border-gray-200" />

            {/* Description heading and lines */}
            <div className="mb-2 h-4 w-36 rounded bg-gray-200 animate-pulse" />
            <div className="mb-2 h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="mb-8 h-4 w-4/5 rounded bg-gray-200 animate-pulse" />

            {/* Quantity and Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-9 w-36 rounded bg-gray-200 animate-pulse" />
              <div className="h-11 w-44 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
