import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'My Orders | Trendify',
  description: 'View your recent order history and order tracking on Trendify.',
};

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Back to Shopping
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Package size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-sm text-gray-500">
              Track, return, or buy items again.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="rounded-lg bg-gray-50 p-6 text-center border border-dashed border-gray-200">
            <p className="text-gray-600 font-medium">
              You currently have 0 open orders.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              (This is a protected page guarded by Next.js Middleware)
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 bg-brand-orange text-white rounded-md text-sm font-semibold hover:bg-brand-orange/90 transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
