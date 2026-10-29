import { getProductsServer } from '@/services/serverProductService';
import FeaturedProductCarousel from '@/components/product/FeaturedProductCarousel';
import StateMessage from '@/components/common/StateMessage';
import type { Product } from '@/types';

/**
 * Async Server Component for Featured Products.
 * Fetches products on the server and streams independently inside a Suspense boundary.
 * Renders unified StateMessage on failure or empty catalog.
 */
export default async function FeaturedProductsSection() {
  let products: Product[] | null = null;
  let hasError = false;

  try {
    const result = await getProductsServer({ pageSize: 8 });
    products = result.products;
  } catch (error) {
    console.error('[FEATURED PRODUCTS] Failed to load:', error);
    hasError = true;
  }

  if (hasError || !products) {
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

  return <FeaturedProductCarousel products={products} />;
}
