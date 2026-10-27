import type { Metadata } from 'next';
import Link from 'next/link';
import { getProductsServer } from '@/services/serverProductService';
import ProductGrid from '@/components/product/ProductGrid';
import StateMessage from '@/components/common/StateMessage';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import { Suspense } from 'react';
import StoreLoading from './loading';
import { ProductSortBy, SortOrder } from '@/types/ProductSorting';
import type { ProductSearchParams } from '@/types/ProductSearchParams';
import { getValidInt, getValidFloat } from '@/utils/urlHelpers';

export const metadata: Metadata = {
  title: 'Products | Trendify',
  description:
    'Browse our complete catalog of electronics, lifestyle, and fashion products with instant filtering and search.',
};

export const revalidate = 60;

const PAGE_SIZE = 12;

interface ProductListingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ProductListingPage({
  searchParams,
}: ProductListingPageProps) {
  return (
    <Suspense fallback={<StoreLoading />}>
      <ProductListingContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductListingContent({
  searchParams,
}: ProductListingPageProps) {
  const rawParams = await searchParams;

  // Convert raw searchParams promise result into URLSearchParams for parsing
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawParams || {})) {
    if (typeof value === 'string') {
      urlParams.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      urlParams.set(key, value[0]);
    }
  }

  // 1. Parse and validate URL query parameters on the server
  const searchTerm = urlParams.get('search')?.trim() || '';
  const categoryId = getValidInt(urlParams, 'categoryId', 1);
  const brandId = getValidInt(urlParams, 'brandId', 1);
  const minRating = getValidFloat(urlParams, 'minRating', 1, 5);
  const page = getValidInt(urlParams, 'page', 1) ?? 1;

  let minPrice = getValidFloat(urlParams, 'minPrice', 0);
  let maxPrice = getValidFloat(urlParams, 'maxPrice', 0);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  const rawSortBy = urlParams.get('sortBy');
  const isValidSortBy = (val: string | null): val is ProductSortBy =>
    Object.values(ProductSortBy).some((v) => v === val);
  const sortBy = isValidSortBy(rawSortBy) ? rawSortBy : undefined;

  const rawSortOrder = urlParams.get('sortOrder');
  const isValidSortOrder = (val: string | null): val is SortOrder =>
    Object.values(SortOrder).some((v) => v === val);
  const sortOrder = isValidSortOrder(rawSortOrder) ? rawSortOrder : undefined;

  // 2. Determine active filter status
  const hasFacetFilters = Boolean(
    categoryId !== undefined ||
      brandId !== undefined ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minRating !== undefined ||
      sortBy !== undefined
  );
  const hasActiveFilters = Boolean(searchTerm !== '' || hasFacetFilters);

  // 3. Assemble query payload for server service
  const apiParams: ProductSearchParams = {
    search: searchTerm || undefined,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    page,
    pageSize: PAGE_SIZE,
  };

  // 4. Fetch data directly on the server (Server Component)
  const { products, totalRecords, totalPages } = await getProductsServer(apiParams);

  let content: React.ReactNode;

  if (products.length === 0) {
    content = hasActiveFilters ? (
      <StateMessage
        title="No products match your criteria"
        message={
          searchTerm
            ? `We couldn't find any products matching "${searchTerm}". Try checking your spelling or clearing your filters.`
            : 'No products match the selected filters. Try broadening your criteria.'
        }
        buttonText="Clear All Filters"
        actionHref="/products"
        variant="empty"
      />
    ) : (
      <StateMessage
        title="No products available."
        message="The store is currently empty. We might be restocking!"
        buttonText="Refresh"
        actionHref="/products"
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

        <Pagination currentPage={page} totalPages={totalPages} />
      </>
    );
  }

  const currentQueryString = urlParams.toString();
  const refreshUrl = currentQueryString ? `/products?${currentQueryString}` : '/products';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0 text-text-main">
          Product Listing
        </h1>
        <Link href={refreshUrl}>
          <Button variant="outline" className="text-xs px-3 py-1.5">
            Refresh
          </Button>
        </Link>
      </div>

      {content}
    </div>
  );
}
