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

const EMPTY_SEARCH_RESULT: ProductSearchResult = {
  products: [],
  page: 1,
  pageSize: 12,
  totalRecords: 0,
  totalPages: 0,
};

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
      // Ensure dynamic searches and filters are never cached as stale results
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream error in getProductsServer [${response.status}]: ${errorText}`
      );
      return {
        ...EMPTY_SEARCH_RESULT,
        page: parsedPage,
        pageSize: parsedPageSize,
      };
    }

    const data: ProductSearchResultDto = await response.json();
    return toClientSearchResult(data);
  } catch (error) {
    console.error('Error in getProductsServer:', error);
    return {
      ...EMPTY_SEARCH_RESULT,
      page: params.page || 1,
      pageSize: params.pageSize || 12,
    };
  }
}

export interface ServerProductDetailResult {
  product: Product | null;
  status: number;
  error?: string;
}

/**
 * Fetches a single product by ID from the upstream .NET API for Server Components.
 * Returns { product, status, error } to distinguish between a genuine 404 Not Found
 * and a 500/network error.
 */
export async function getProductByIdServer(
  id: number
): Promise<ServerProductDetailResult> {
  if (!id || isNaN(id) || id <= 0) {
    return { product: null, status: 400, error: 'Invalid product ID' };
  }

  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/${id}`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return { product: null, status: 404 };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream error in getProductByIdServer for ID ${id} [${response.status}]: ${errorText}`
      );
      return {
        product: null,
        status: response.status,
        error: 'Failed to retrieve product details from upstream server.',
      };
    }

    const data: ProductDto = await response.json();
    return { product: toClientProduct(data), status: 200 };
  } catch (error) {
    console.error(`Error in getProductByIdServer for ID ${id}:`, error);
    return {
      product: null,
      status: 502,
      error: 'The product service is currently unavailable. Please try again.',
    };
  }
}

/**
 * Server-side helper to fetch categories for Server Layouts or Server Components.
 */
export async function getCategoriesServer(): Promise<Category[]> {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Categories?api-version=1`;
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
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
      cache: 'no-store',
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
