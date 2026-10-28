import AddressSkeleton from '@/components/dashboard/AddressSkeleton';
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-80 bg-gray-200 rounded" />
      </div>

      {/* User profile card skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-44 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Address skeleton */}
      <AddressSkeleton />

      {/* Orders skeleton */}
      <RecentOrdersSkeleton />
    </div>
  );
}
