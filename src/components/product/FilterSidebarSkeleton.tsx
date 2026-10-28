export default function FilterSidebarSkeleton() {
  return (
    <aside
      className="w-full border border-gray-200 bg-white p-3.5 rounded-lg shadow-sm animate-pulse space-y-6"
      aria-label="Loading filters"
    >
      {/* Category Section Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="space-y-2 pl-1">
          <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
          <div className="h-3.5 w-3/4 bg-gray-100 rounded" />
          <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
          <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        {/* Brand Section Skeleton */}
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="space-y-2 pl-1">
          <div className="h-3.5 w-3/4 bg-gray-100 rounded" />
          <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
          <div className="h-3.5 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        {/* Price / Rating Skeleton */}
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-8 w-full bg-gray-100 rounded" />
      </div>
    </aside>
  );
}
