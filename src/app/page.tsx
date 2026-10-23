import Hero from '@/components/layout/Hero';
import CategoryGrid from '@/components/product/CategoryGrid';
import FeaturedProductCarousel from '@/components/product/FeaturedProductCarousel';
import ShopByCategory from '@/components/product/ShopByCategory';
import ServiceHighlights from '@/components/layout/ServiceHighlights';
import {
  getProductsServer,
  getCategoriesServer,
} from '@/services/serverProductService';

export const revalidate = 60;

export default async function Home() {
  const [{ products }, categories] = await Promise.all([
    getProductsServer({ pageSize: 8 }),
    getCategoriesServer(),
  ]);

  return (
    <>
      <Hero />

      <div>
        <CategoryGrid />

        <FeaturedProductCarousel products={products} />

        <ShopByCategory categories={categories} />

        <ServiceHighlights />
      </div>
    </>
  );
}

