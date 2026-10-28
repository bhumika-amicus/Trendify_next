import { Package } from 'lucide-react';
import OrderCardSkeleton from '@/components/orders/OrderCardSkeleton';

export default function RecentOrdersSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 animate-pulse">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-gray-300" />
          <div className="h-5 w-36 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>

      {/* Reusable Order Skeletons */}
      <div className="space-y-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}
