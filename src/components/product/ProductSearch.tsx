'use client';

import { Search } from 'lucide-react';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

const styles = {
  header: {
    form: 'order-4 mx-0 mt-3 flex h-10.5 w-full flex-none items-center overflow-hidden rounded border border-gray-300 bg-white transition-colors focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/30 md:order-none md:mx-10 md:mt-0 md:max-w-150 md:flex-1',
    input: 'h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400',
    button: 'flex h-full w-11.5 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none',
  },
  hero: {
    form: 'mt-6 flex h-12 w-full max-w-[600px] items-center overflow-hidden rounded bg-white transition-colors focus-within:ring-2 focus-within:ring-brand-orange/30',
    input: 'h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-gray-700 outline-none placeholder:text-gray-400',
    button: 'flex h-full w-12 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none',
  },
};

export interface ProductSearchProps {
  variant?: 'header' | 'hero';
  placeholder?: string;
}

function ProductSearchContent({
  variant = 'header',
  placeholder = 'Search',
}: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const committedSearch = searchParams?.get('search') ?? '';
  // Only stores intermediate text while the user is actively typing in this specific box.
  // When null, the input cleanly displays the `committedSearch` from the URL directly.
  const [draftInput, setDraftInput] = useState<string | null>(null);
  const displayValue = draftInput !== null ? draftInput : committedSearch;

  const debouncedSearchTerm = useDebounce(draftInput, 300);

  const performSearch = useCallback(
    (query: string) => {
      const isListingPage = pathname === '/products';
      const nextParams = new URLSearchParams(
        isListingPage ? searchParams?.toString() : undefined
      );

      if (query) {
        nextParams.set('search', query);
      } else {
        nextParams.delete('search');
      }

      nextParams.set('page', '1');

      const queryString = nextParams.toString();
      const targetUrl = queryString ? `/products?${queryString}` : '/products';
      router.push(targetUrl);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    // Only search on type if the user actively typed in THIS input and we are on /products
    if (debouncedSearchTerm === null) return;
    if (pathname !== '/products') return;

    const trimmed = debouncedSearchTerm.trim();
    const currentSearch = searchParams?.get('search') ?? '';

    if (trimmed !== currentSearch) {
      performSearch(trimmed);
    }
  }, [debouncedSearchTerm, pathname, searchParams, performSearch]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = (draftInput !== null ? draftInput : committedSearch).trim();
    setDraftInput(null);
    performSearch(query);
  }

  return (
    <form className={styles[variant].form} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        placeholder={placeholder}
        value={displayValue}
        onChange={(event) => setDraftInput(event.target.value)}
        onBlur={() => setDraftInput(null)}
        aria-label="Search products"
        className={styles[variant].input}
      />
      <button type="submit" className={styles[variant].button} aria-label="Search">
        <Search size={20} />
      </button>
    </form>
  );
}

export default function ProductSearch(props: ProductSearchProps) {
  return (
    <Suspense fallback={<div className={styles[props.variant || 'header'].form} />}>
      <ProductSearchContent {...props} />
    </Suspense>
  );
}
