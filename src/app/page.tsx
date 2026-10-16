'use client';

import Hero from '@/components/layout/Hero';
import CategoryGrid from '@/components/product/CategoryGrid';
import FeaturedProductCarousel from '@/components/product/FeaturedProductCarousel';
import ShopByCategory from '@/components/product/ShopByCategory';
import ServiceHighlights from '@/components/layout/ServiceHighlights';
import { getCategories, getProducts } from '@/services/productApi';
import { useFetch } from '@/hooks/useFetch';
import type { Product } from '@/types/Products';
import type { Category } from '@/types/Categories';

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_CATEGORIES: Category[] = [];

export default function Home() {
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useFetch(getProducts);

  const products = productsData || EMPTY_PRODUCTS;

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(getCategories);

  const categories = categoriesData || EMPTY_CATEGORIES;

  return (
    <>
      <Hero />

      <div>
        <CategoryGrid />

        <FeaturedProductCarousel
          products={products}
          isLoading={isProductsLoading}
          error={productsError}
          onRetry={refetchProducts}
        />

        <ShopByCategory
          categories={categories}
          isLoading={isCategoriesLoading}
          error={categoriesError}
          onRetry={refetchCategories}
        />

        <ServiceHighlights />
      </div>
    </>
  );
}
