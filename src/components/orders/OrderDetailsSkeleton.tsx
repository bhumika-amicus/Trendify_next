/**
 * Presentation Skeleton for expanded Order Details.
 * Mimics the 3-section layout (Ordered Items, 2-Column Shipping & Payment, Price Breakdown)
 * to prevent layout shifts (CLS) while order line items are being fetched.
 */
export default function OrderDetailsSkeleton() {
  return (
    <div
      className="mt-4 pt-4 border-t border-gray-100 space-y-5 animate-pulse"
      aria-busy="true"
      aria-label="Loading order details"
    >
      {/* 1. Items List Skeleton */}
      <div>
        <div className="h-3.5 w-28 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
            <div className="space-y-1.5 w-1/2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
            <div className="space-y-1.5 w-1/2">
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* 2. 2-Column Grid Skeleton (Shipping & Payment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
          <div className="h-3.5 w-28 bg-gray-200 rounded" />
          <div className="h-3.5 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2.5">
          <div className="h-3.5 w-36 bg-gray-200 rounded" />
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* 3. Breakdown Box Skeleton */}
      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
        <div className="h-3.5 w-32 bg-gray-200 rounded" />
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
