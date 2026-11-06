import { Home, ShoppingBag, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center py-12">
      <div className="flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6">
        <AlertCircle size={40} className="text-brand-orange" aria-hidden="true" />
      </div>

      <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-gray-900 mb-4">
        Page Not Found
      </h1>

      <p className="text-lg text-gray-600 max-w-md mx-auto mb-10">
        Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-none mx-auto">
        <Button
          href="/"
          variant="secondary"
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Button>

        <Button
          href="/products"
          variant="primary"
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ShoppingBag size={18} />
          <span>Browse Products</span>
        </Button>
      </div>
    </div>
  );
}
