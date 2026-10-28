/**
Reusable Order Card Skeleton matching the React application's OrderCardSkeleton.
 Used across the dashboard recent orders section and the main orders history page.
 */
export default function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-5 space-y-3 animate-pulse">
      {/* Top row: Order ID and Status Badge */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>

      {/* Bottom row: Date/Amount and Action Button */}
      <div className="flex justify-between items-center pt-1">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}
