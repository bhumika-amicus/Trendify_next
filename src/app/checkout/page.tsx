import Link from 'next/link';
import { CreditCard, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Secure Checkout | Trendify',
  description: 'Complete your purchase securely on Trendify.',
};

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/cart"
          className="text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CreditCard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck size={16} className="text-green-600" /> 256-bit Encrypted Checkout
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="rounded-lg bg-gray-50 p-6 text-center border border-dashed border-gray-200">
            <p className="text-gray-600 font-medium">
              Checkout session ready.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              (This is a protected route guarded by Next.js Middleware)
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 bg-brand-orange text-white rounded-md text-sm font-semibold hover:bg-brand-orange/90 transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
