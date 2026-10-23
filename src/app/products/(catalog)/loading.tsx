import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';

export default function CatalogLoading() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0 text-text-main">
          Product Listing
        </h1>
      </div>

      <div className="mb-5 h-5 w-48 rounded bg-gray-200 animate-pulse" />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
