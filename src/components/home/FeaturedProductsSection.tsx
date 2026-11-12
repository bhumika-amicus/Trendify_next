import dynamic from 'next/dynamic';
import { getFeaturedProductsServer } from '@/services/serverProductService';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';
import StateMessage from '@/components/common/StateMessage';

// Code-split Swiper + CSS chunks out of the initial `/` bundle while still SSR-rendering product HTML
const FeaturedProductCarousel = dynamic(() => import('./FeaturedProductCarousel'), {
  loading: () => <FeaturedProductsSkeleton />,
});

/**
 * Async Server Component for Featured Products.
 * Fetches products on the server and streams independently inside a Suspense boundary.
 * Renders an inline error state if the service is down, or empty state if no products exist.
 */
export default async function FeaturedProductsSection() {

  const products = await getFeaturedProductsServer(8);

  if (products === null) {
    return (
      <section className="w-full max-w-full overflow-hidden px-11 py-16 max-[650px]:px-4.5">
        <div className="section-heading mb-6!">
          <h2>Featured Products</h2>
        </div>
        <StateMessage
          title="Unable to load featured products"
          message="We're having trouble connecting to our servers right now. Please try again."
          buttonText="Retry"
          actionHref="/"
          variant="error"
          compact
        />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full max-w-full overflow-hidden px-11 py-16 max-[650px]:px-4.5">
        <div className="section-heading mb-6!">
          <h2>Featured Products</h2>
        </div>
        <StateMessage
          title="No featured products"
          message="Check back soon for new arrivals."
          buttonText="Browse Products"
          actionHref="/products"
          variant="empty"
          compact
        />
      </section>
    );
  }

  return <FeaturedProductCarousel products={products} />;
}
