import type { PaginatedResult } from './common';

/**
 * Domain entity representing a product in the frontend application.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category: string;
  brandId: number;
  brand: string;
  rating: number;
}

/**
 * Raw upstream .NET API product DTO shape.
 */
export interface ProductDto {
  productId: number;
  name: string | null;
  description: string | null;
  categoryId: number;
  categoryName: string | null;
  brandId: number;
  brandName: string | null;
  price: number;
  rating: number;
}

/**
 * Client DTO for creating a new product.
 */
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  brandId: number;
  rating?: number;
}

/**
 * Client DTO for updating an existing product.
 */
export interface UpdateProductDto {
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  rating?: number;
}

/**
 * Outbound payload expected by .NET POST /api/v1/Products
 */
export interface DotnetCreateProductPayload {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  rating: number;
}

/**
 * Outbound payload expected by .NET PUT /api/v1/Products/{id}
 */
export interface DotnetUpdateProductPayload {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  rating: number;
}

/**
 * Sorting keys and direction for products.
 */
export enum ProductSortBy {
  Name = 'name',
  Price = 'price',
  Rating = 'rating',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

/**
 * Parameters for searching, filtering, and paginating products.
 */
export interface ProductSearchParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

/**
 * Aliases for paginated product results.
 */
export type ProductSearchResult = PaginatedResult<Product>;
export type ProductSearchResultDto = PaginatedResult<ProductDto>;
