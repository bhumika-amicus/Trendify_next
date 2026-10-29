import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';

/**
 * Server Component Skeleton for the Featured Products carousel.
 * Rendered at 0ms by Next.js streaming Suspense with zero client-side JavaScript.
 */
export default function FeaturedProductsSkeleton() {
  return (
    <section
      id="products-loading"
      className="w-full max-w-full overflow-hidden px-11 py-16 max-[650px]:px-4.5"
      aria-busy="true"
      aria-label="Loading featured products"
    >
      <div className="section-heading mb-6!">
        <h2>Featured Products</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
