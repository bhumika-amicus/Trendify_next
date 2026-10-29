import Link from 'next/link';
import Card from '@/components/common/Card';
import StateMessage from '@/components/common/StateMessage';
import type { Category } from '@/types';

interface ShopByCategoryProps {
  categories: Category[];
}

/**
 * Presentation component for category cards grid.
 * Renders categories or an empty state when catalog categories are empty.
 */
export default function ShopByCategory({ categories }: ShopByCategoryProps) {
  return (
    <section className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8">
      <div className="section-heading mb-6!">
        <h2>Shop by Category</h2>
      </div>

      {categories.length === 0 ? (
        <StateMessage
          title="No categories available"
          message="No categories are available at the moment. Please check back later."
          buttonText="Browse Products"
          actionHref="/products"
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
