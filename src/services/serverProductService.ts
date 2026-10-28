
import { cache } from 'react';
import { DOTNET_API_BASE_URL } from '@/config';
import { toClientSearchResult, toClientProduct } from '@/lib/productAdapter';
import type { ProductSearchParams } from '@/types/ProductSearchParams';
import type { ProductSearchResult } from '@/types/ProductSearchResult';
import type { ProductSearchResultDto } from '@/types/ProductSearchResultDto';
import type { ProductDto } from '@/types/ProductDto';
import type { Product } from '@/types/Products';
import type { Category } from '@/types/Categories';
import type { CategoryDto } from '@/types/CategoryDto';
import type { Brand } from '@/types/Brands';
import type { BrandDto } from '@/types/BrandDto';


/**
 * Fetches products from the upstream .NET API for Server Components.
 * Runs strictly on the server in Node.js (SSR / Server Component rendering).
 * Supports search, filtering, sorting, and pagination without any client-side waterfalls.
 */
export async function getProductsServer(
  params: ProductSearchParams = {}
): Promise<ProductSearchResult> {
  try {
    const parsedPage = Math.max(1, Number(params.page) || 1);
    const parsedPageSize = Math.min(
      100,
      Math.max(1, Number(params.pageSize) || 12)
    );

    const upstreamParams = new URLSearchParams();
    upstreamParams.set('Page', String(parsedPage));
    upstreamParams.set('PageSize', String(parsedPageSize));

    const search = params.search?.trim();
    if (search) upstreamParams.set('Search', search);
    if (params.categoryId !== undefined) upstreamParams.set('CategoryId', String(params.categoryId));
    if (params.brandId !== undefined) upstreamParams.set('BrandId', String(params.brandId));
    if (params.minPrice !== undefined) upstreamParams.set('MinPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) upstreamParams.set('MaxPrice', String(params.maxPrice));
    if (params.minRating !== undefined) upstreamParams.set('MinRating', String(params.minRating));
    if (params.sortBy) upstreamParams.set('SortBy', params.sortBy);
    if (params.sortOrder) upstreamParams.set('SortOrder', params.sortOrder);

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/search?${upstreamParams.toString()}`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Revalidate product search/listings every 60 seconds (ISR)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream error in getProductsServer [${response.status}]: ${errorText}`
      );
      throw new Error('Failed to load products from upstream service.');
    }

    const data: ProductSearchResultDto = await response.json();
    return toClientSearchResult(data);
  } catch (error) {
    if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error in getProductsServer:', error);
    throw new Error('The product service is currently unavailable. Please try again.');
  }
}

/**
 * Fetches a single product by ID from the upstream .NET API for Server Components.
 * Returns Product if found, null if 404, or throws if upstream crashes so error.tsx catches it.
 * Memoized per request lifecycle using React.cache() so generateMetadata and the page share one fetch.
 */
export const getProductByIdServer = cache(
  async (id: number): Promise<Product | null> => {
    if (!id || isNaN(id) || id <= 0) {
      return null;
    }

    try {
      const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/${id}`;

      const response = await fetch(upstreamUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60 },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Upstream error in getProductByIdServer for ID ${id} [${response.status}]: ${errorText}`
        );
        throw new Error('Failed to retrieve product details from upstream server.');
      }

      const data: ProductDto = await response.json();
      return toClientProduct(data);
    } catch (error) {
      if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
        throw error;
      }
      console.error(`Error in getProductByIdServer for ID ${id}:`, error);
      throw new Error('The product service is currently unavailable. Please try again.');
    }
  }
);

/**
 * Server-side helper to fetch categories for Server Layouts or Server Components.
 */
export async function getCategoriesServer(): Promise<Category[]> {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Categories?api-version=1`;
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    const data: CategoryDto[] = await response.json();
    return (data || []).map((c) => ({
      id: c.categoryId,
      name: c.name,
    }));
  } catch (error) {
    if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error in getCategoriesServer:', error);
    return [];
  }
}

/**
 * Server-side helper to fetch brands for Server Layouts or Server Components.
 */
export async function getBrandsServer(): Promise<Brand[]> {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Brands?api-version=1`;
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    const data: BrandDto[] = await response.json();
    return (data || []).map((b) => ({
      id: b.brandId,
      name: b.name,
    }));
  } catch (error) {
    if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error in getBrandsServer:', error);
    return [];
  }
}
