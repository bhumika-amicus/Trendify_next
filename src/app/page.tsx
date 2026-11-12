import type { Metadata } from 'next';
import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import PromoBannerGrid from '@/components/home/PromoBannerGrid';
import ServiceHighlights from '@/components/home/ServiceHighlights';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import FeaturedProductsSkeleton from '@/components/home/FeaturedProductsSkeleton';
import ShopByCategorySection from '@/components/home/ShopByCategorySection';
import ShopByCategorySkeleton from '@/components/home/ShopByCategorySkeleton';

export const metadata: Metadata = {
  title: {
    absolute: 'Trendify | Premium E-Commerce Store',
  },
  description:
    'Shop the latest electronics, fashion, and lifestyle essentials with verified quality and lightning-fast delivery on Trendify.',
};

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
