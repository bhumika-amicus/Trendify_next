import type { Metadata } from 'next';
import Link from 'next/link';
import { getProductsServer } from '@/services/serverProductService';
import ProductGrid from '@/components/product/ProductGrid';
import StateMessage from '@/components/common/StateMessage';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import { parseProductSearchParams } from '@/utils/productParams';

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

export default async function ProductListingPage({
  searchParams,
}: ProductListingPageProps) {
  const rawParams = await searchParams;
  const {
    urlParams,
    searchTerm,
    hasActiveFilters,
    apiParams,
    page,
  } = parseProductSearchParams(rawParams, PAGE_SIZE);

  // Fetch data directly on the server (Server Component)
  const { products, totalRecords, totalPages } = await getProductsServer(apiParams);

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

      {products.length === 0 ? (
        hasActiveFilters ? (
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
        )
      ) : (
        <>
          <p className="mb-5 text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalRecords)} of {totalRecords} products
            {searchTerm && ` for "${searchTerm}"`}
          </p>

          <ProductGrid products={products} />

          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
