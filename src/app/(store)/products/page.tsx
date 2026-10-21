'use client';

import { type ReactNode, Suspense } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useProductFilters } from '@/hooks/useProductFilters';

import ProductGrid from '@/components/product/ProductGrid';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import StateMessage from '@/components/common/StateMessage';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import { searchProducts } from '@/services/productApi';
import type { Product } from '@/types/Products';

const PAGE_SIZE = 12;
const EMPTY_PRODUCTS: Product[] = [];

function ProductListingContent() {
  const {
    searchTerm,
    page,
    hasActiveFilters,
    updatePage,
    apiParams,
    filterKey,
    resetAllFilters,
  } = useProductFilters();

  const {
    data: productsData,
    isLoading,
    error,
    refetch: refetchProducts,
  } = useFetch(
    (signal) => searchProducts({ ...apiParams, pageSize: PAGE_SIZE }, signal),
    [filterKey]
  );

  const products = productsData?.products || EMPTY_PRODUCTS;
  const totalRecords = productsData?.totalRecords || 0;
  const totalPages = productsData?.totalPages || 0;

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <StateMessage
        title="Oops! Something went wrong."
        message="We are having trouble connecting to our servers right now."
        buttonText="Try Again"
        onAction={refetchProducts}
      >
        <div className="inline-block text-left">
          <p className="mb-2 font-medium">Troubleshooting Tips:</p>
          <ul className="ml-5 list-disc text-gray-600">
            <li className="mb-1.5 text-base">Check your internet connection</li>
            <li className="mb-1.5 text-base">Wait a moment and try again</li>
          </ul>
        </div>
      </StateMessage>
    );
  } else if (products.length === 0) {
    content = hasActiveFilters ? (
      <StateMessage
        title="No products match your criteria"
        message={
          searchTerm
            ? `We couldn't find any products matching "${searchTerm}". Try checking your spelling or clearing your filters.`
            : 'No products match the selected filters. Try broadening your criteria.'
        }
        buttonText="Clear All Filters"
        onAction={resetAllFilters}
        variant="empty"
      />
    ) : (
      <StateMessage
        title="No products available."
        message="The store is currently empty. We might be restocking!"
        buttonText="Refresh"
        onAction={refetchProducts}
        variant="empty"
      />
    );
  } else {
    const startRecord = (page - 1) * PAGE_SIZE + 1;
    const endRecord = Math.min(page * PAGE_SIZE, totalRecords);

    content = (
      <>
        <p className="mb-5 text-sm text-gray-600">
          Showing {startRecord}–{endRecord} of {totalRecords} products
          {searchTerm && ` for "${searchTerm}"`}
        </p>

        <ProductGrid products={products} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={updatePage}
        />
      </>
    );
  }

  return (
    <div className="w-full">
      <Breadcrumbs className="mb-4" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0 text-text-main">
          Product Listing
        </h1>
        {isLoading ? (
          <Button variant="outline" disabled className="text-xs px-3 py-1.5">
            Refresh
          </Button>
        ) : !error && products.length > 0 ? (
          <Button
            variant="outline"
            onClick={refetchProducts}
            className="text-xs px-3 py-1.5"
          >
            Refresh
          </Button>
        ) : null}
      </div>

      {content}
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense
      fallback={
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ProductListingContent />
    </Suspense>
  );
}
