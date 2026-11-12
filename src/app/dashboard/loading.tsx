import AddressSkeleton from '@/components/dashboard/AddressSkeleton';
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-80 max-w-full bg-gray-200 rounded" />
      </div>

      {/* Address skeleton */}
      <AddressSkeleton />

      {/* Orders skeleton */}
      <RecentOrdersSkeleton />
    </div>
  );
}
