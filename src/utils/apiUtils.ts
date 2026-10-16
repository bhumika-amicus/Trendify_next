import type { ProductDto } from '../types/ProductDto';
import type { Product } from '../types/Products';
import type { CategoryDto } from '../types/CategoryDto';
import type { Category } from '../types/Categories';
import type { BrandDto } from '../types/BrandDto';
import type { Brand } from '../types/Brands';

export function transformProduct(product: ProductDto): Product {
  return {
    id: product.productId,
    name: product.name ?? 'Unnamed Product',
    description: product.description ?? '',
    price: product.price,
    imageUrl: '',
    categoryId: product.categoryId,
    category: product.categoryName ?? 'Uncategorized',
    brandId: product.brandId,
    brand: product.brandName ?? 'Unknown Brand',
    rating: product.rating,
  };
}

export function transformCategory(category: CategoryDto): Category {
  return {
    id: category.categoryId,
    name: category.name,
  };
}

export function transformBrand(brand: BrandDto): Brand {
  return {
    id: brand.brandId,
    name: brand.name,
  };
}
