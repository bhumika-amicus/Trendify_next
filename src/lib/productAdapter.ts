import type { ProductDto } from '@/types/ProductDto';
import type { Product } from '@/types/Products';
import type { ProductSearchResultDto } from '@/types/ProductSearchResultDto';
import type { ProductSearchResult } from '@/types/ProductSearchResult';

/**
 * Transforms a .NET ProductDto into the Product shape used across the React app.
 * Matches the logic from my-app's transformProduct.
 */
export function toClientProduct(product: ProductDto): Product {
  return {
    id: product.productId,
    name: product.name ?? 'Unnamed Product',
    description: product.description ?? '',
    price: product.price ?? 0,
    imageUrl: '', // Exactly matching my-app: .NET API has no product images
    categoryId: product.categoryId ?? 0,
    category: product.categoryName ?? 'Uncategorized',
    brandId: product.brandId ?? 0,
    brand: product.brandName ?? 'Unknown Brand',
    rating: product.rating ?? 0,
  };
}

/**
 * Transforms a .NET paginated search response into the client ProductSearchResult.
 * Supplies totalCount (for Assignment 4) and totalRecords (for existing ProductListing UI).
 */
export function toClientSearchResult(
  data: ProductSearchResultDto
): ProductSearchResult & { totalCount: number } {
  return {
    products: Array.isArray(data.products)
      ? data.products.map(toClientProduct)
      : [],
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 12,
    totalRecords: data.totalRecords ?? 0,
    totalPages: data.totalPages ?? 0,
    totalCount: data.totalRecords ?? 0,
  };
}
