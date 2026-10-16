import { Suspense } from 'react';
import FilterSidebar from '@/components/product/FilterSidebar';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-360 px-4.5 py-6 sm:px-6 md:px-10">
      <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[180px_1fr]">
        {/* Category & Facet Sidebar wrapped in Suspense */}
        <Suspense
          fallback={
            <aside className="border border-gray-300 bg-white p-3 h-96 animate-pulse" />
          }
        >
          <FilterSidebar />
        </Suspense>

        {/* Store Content (Product Listing) */}
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
