/**
 * Server Component Skeleton for the Shop by Category section.
 * Rendered at 0ms by Next.js streaming Suspense with zero client-side JavaScript.
 */
export default function ShopByCategorySkeleton() {
  return (
    <section
      className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8"
      aria-busy="true"
      aria-label="Loading categories"
    >
      <div className="section-heading mb-6!">
        <h2>Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    </section>
  );
}
