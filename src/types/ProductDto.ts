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

