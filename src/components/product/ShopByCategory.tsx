import Link from 'next/link';
import Card from '@/components/common/Card';
import StateMessage from '@/components/common/StateMessage';
import type { Category } from '@/types/product';

interface ShopByCategoryProps {
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ShopByCategory({
  categories,
  isLoading,
  error,
  onRetry,
}: ShopByCategoryProps) {
  return (
    <section className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8">
      <div className="section-heading mb-6!">
        <h2>Shop by Category</h2>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          aria-label="Loading categories"
          aria-busy="true"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <StateMessage
          title="Unable to load categories"
          message="We're having trouble connecting to our servers right now."
          buttonText="Try Again"
          onAction={onRetry}
          variant="error"
          compact
        />
      ) : categories.length === 0 ? (
        <StateMessage
          title="No categories available"
          message="No categories are available at the moment. Please check back later."
          buttonText={onRetry ? 'Refresh' : undefined}
          onAction={onRetry}
          variant="empty"
          compact
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="no-underline"
            >
              <Card
                variant="bordered"
                className="cursor-pointer items-center justify-center px-5 py-4 text-center transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
              >
                <h3 className="m-0 text-sm font-semibold tracking-normal text-brand-orange">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
