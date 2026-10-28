import { Suspense } from 'react';
import FilterSidebarSection from '@/components/product/FilterSidebarSection';
import FilterSidebarSkeleton from '@/components/product/FilterSidebarSkeleton';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-360 px-3 sm:px-5 md:px-6 py-5 sm:py-6">
      <div className="grid grid-cols-1 gap-5 items-start lg:grid-cols-[225px_1fr] lg:gap-6">
        {/* Category & Facet Sidebar streams independently in parallel */}
        <Suspense fallback={<FilterSidebarSkeleton />}>
          <FilterSidebarSection />
        </Suspense>

        {/* Catalog Content (Product Listing) */}
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

