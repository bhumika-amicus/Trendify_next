import Link from 'next/link';
import Card from '@/components/common/Card';
import type { Category } from '@/types';

interface ShopByCategoryProps {
  categories: Category[];
}

export default function ShopByCategory({ categories }: ShopByCategoryProps) {
  return (
    <section className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8">
      <div className="section-heading mb-6!">
        <h2>Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.categoryId}
            href={`/products?categoryId=${category.categoryId}`}
            className="no-underline"
          >
            <Card
              variant="bordered"
              hoverable
              className="items-center justify-center px-5 py-4 text-center"
            >
              <h3 className="m-0 text-sm font-semibold tracking-normal text-brand-orange">
                {category.name}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
