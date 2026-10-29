import { Suspense } from 'react';
import Hero from '@/components/layout/Hero';
import CategoryGrid from '@/components/product/CategoryGrid';
import ServiceHighlights from '@/components/layout/ServiceHighlights';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import FeaturedProductsSkeleton from '@/components/home/FeaturedProductsSkeleton';
import ShopByCategorySection from '@/components/home/ShopByCategorySection';
import ShopByCategorySkeleton from '@/components/home/ShopByCategorySkeleton';

// Incremental Static Regeneration (ISR): Background cache revalidation window
export const revalidate = 60;

/**
 * Optimized Home Page.
 * Uses granular Suspense streaming:
 * - <Hero />, <CategoryGrid />, and <ServiceHighlights /> render immediately at 0ms.
 * - <FeaturedProductsSection /> and <ShopByCategorySection /> stream in parallel
 *   with zero-bundle Server Component skeletons and graceful error handling.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <div>
        <CategoryGrid />

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>

        <Suspense fallback={<ShopByCategorySkeleton />}>
          <ShopByCategorySection />
        </Suspense>

        <ServiceHighlights />
      </div>
    </>
  );
}
