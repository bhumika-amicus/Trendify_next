import { MapPin } from 'lucide-react';

export default function AddressSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-300" />
          <div className="h-4 w-44 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded" />
      </div>

      <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-100 space-y-2.5">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
