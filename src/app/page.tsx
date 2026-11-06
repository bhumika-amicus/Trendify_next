import { Suspense } from 'react';
import Hero from '@/components/layout/Hero';
import PromoBannerGrid from '@/components/product/PromoBannerGrid';
import ServiceHighlights from '@/components/layout/ServiceHighlights';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import FeaturedProductsSkeleton from '@/components/home/FeaturedProductsSkeleton';
import ShopByCategorySection from '@/components/home/ShopByCategorySection';
import ShopByCategorySkeleton from '@/components/home/ShopByCategorySkeleton';

// Incremental Static Regeneration (ISR)
export const revalidate = 60;

export default function Home() {
  
  return (
    <>
      <Hero />

      <div>
        <PromoBannerGrid />

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
