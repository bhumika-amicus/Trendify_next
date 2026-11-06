import { cache } from 'react';
import { serverApiFetch } from './serverApi';
import { toClientSearchResult, toClientProduct } from '@/utils/productAdapter';
import type {
  ProductSearchParams,
  ProductSearchResult,
  ProductSearchResultDto,
  ProductDto,
  Product,
  Category,
  Brand,
} from '@/types';

/**
 * Fetches paginated and filtered product search results from the .NET API.
 * Throws an error on upstream failure so that route-level Error Boundaries (error.tsx) can catch it.
 */
export async function getProductsServer(
  params: ProductSearchParams = {}
): Promise<ProductSearchResult> {
  const parsedPage = Math.max(1, Number(params.page) || 1);
  const parsedPageSize = Math.min(
    100,
    Math.max(1, Number(params.pageSize) || 12)
  );

  const queryParams = new URLSearchParams();
  queryParams.set('Page', String(parsedPage));
  queryParams.set('PageSize', String(parsedPageSize));

  const search = params.search?.trim();
  if (search) queryParams.set('Search', search);
  if (params.categoryId !== undefined) queryParams.set('CategoryId', String(params.categoryId));
  if (params.brandId !== undefined) queryParams.set('BrandId', String(params.brandId));
  if (params.minPrice !== undefined) queryParams.set('MinPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) queryParams.set('MaxPrice', String(params.maxPrice));
  if (params.minRating !== undefined) queryParams.set('MinRating', String(params.minRating));
  if (params.sortBy) queryParams.set('SortBy', params.sortBy);
  if (params.sortOrder) queryParams.set('SortOrder', params.sortOrder);

  const res = await serverApiFetch<ProductSearchResultDto>(
    `/api/v1/Products/search?${queryParams.toString()}`,
    { next: { revalidate: 60, tags: ['products'] } }
  );

  if (!res.ok || !res.data) {
    throw new Error(res.error || 'Failed to load products from upstream service.');
  }

  return toClientSearchResult(res.data);
}

/**
 * Fetches featured products for homepage widgets.
 * Returns Product[] on success, or null on upstream failure so the widget
 * can render an inline fallback without crashing the entire page.
 */
export async function getFeaturedProductsServer(
  pageSize = 8
): Promise<Product[] | null> {
  const res = await serverApiFetch<ProductSearchResultDto>(
    `/api/v1/Products/search?Page=1&PageSize=${pageSize}`,
    { next: { revalidate: 60, tags: ['products'] } }
  );

  if (!res.ok || !res.data) {
    console.error('[FEATURED PRODUCTS] Upstream failure:', res.error);
    return null;
  }

  return toClientSearchResult(res.data).products;
}

/**
 * Fetches a single product by ID from the upstream .NET API.
 * - Returns Product if found
 * - Returns null on 404 (handled by notFound() in page.tsx)
 * - Throws on 500 / network error (handled by error.tsx)
 * Memoized per request lifecycle using React.cache() so generateMetadata and page share one fetch.
 */
export const getProductByIdServer = cache(
  async (id: number): Promise<Product | null> => {
    if (!id || isNaN(id) || id <= 0) {
      return null;
    }

    const res = await serverApiFetch<ProductDto>(`/api/v1/Products/${id}`, {
      next: { revalidate: 60, tags: ['products', `product-${id}`] },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok || !res.data) {
      throw new Error(res.error || `Failed to load product details for ID ${id}`);
    }

    return toClientProduct(res.data);
  }
);

/**
 * Fetches categories for layouts, navigation, and sidebar filters.
 * - Returns Category[] on success (empty array if store has 0 categories)
 * - Returns null on upstream failure (500 or offline)
 */
export async function getCategoriesServer(): Promise<Category[] | null> {
  const res = await serverApiFetch<Category[]>('/api/Categories?api-version=1', {
    next: { revalidate: 300, tags: ['categories'] },
  });

  if (!res.ok) {
    console.error('[CATEGORIES] Upstream failure:', res.error);
    return null;
  }

  return Array.isArray(res.data) ? res.data : [];
}

/**
 * Fetches brands for filter sidebars and product forms.
 * - Returns Brand[] on success (empty array if 0 brands exist)
 * - Returns null on upstream failure
 */
export async function getBrandsServer(): Promise<Brand[] | null> {
  const res = await serverApiFetch<Brand[]>('/api/Brands?api-version=1', {
    next: { revalidate: 300, tags: ['brands'] },
  });

  if (!res.ok) {
    console.error('[BRANDS] Upstream failure:', res.error);
    return null;
  }

  return Array.isArray(res.data) ? res.data : [];
}
