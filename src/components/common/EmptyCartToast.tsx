'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

// Client listener to capture ?emptyCart=true query parameter on redirect

export default function EmptyCartToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasFired = useRef(false);

  useEffect(() => {
    if (searchParams.get('emptyCart') === 'true' && !hasFired.current) {
      hasFired.current = true;
      toast.error('Your cart is empty. Please add items before checking out.', {
        id: 'empty-cart-toast',
        duration: 4000,
      });

      // Silently clean URL parameter without triggering a reload
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete('emptyCart');
      const newQuery = nextParams.toString();
      router.replace(newQuery ? `/products?${newQuery}` : '/products', {
        scroll: false,
      });
    }
  }, [searchParams, router]);

  return null;
}
