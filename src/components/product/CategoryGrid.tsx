import Link from 'next/link';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-350 px-4 pt-15 pb-5 sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-4 min-[501px]:grid-cols-2 min-[1001px]:grid-cols-4">
        
        <Card
          variant="elevated"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-2xl min-[501px]:text-3xl font-bold leading-tight">
              New Arrivals
            </h3>

            <p className="m-0 mb-2.5 text-sm min-[501px]:text-base leading-normal text-text-muted">
              Check out the latest additions.
            </p>
          </div>

          <Link href="/products" className="w-full">
            <Button variant="primary" className="w-full">
              SHOP NEW
            </Button>
          </Link>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-2xl min-[501px]:text-3xl font-bold leading-tight">
              Best Sellers
            </h3>

            <p className="m-0 mb-2.5 text-sm min-[501px]:text-base leading-normal text-text-muted">
              Shop our most popular items.
            </p>
          </div>

          <Link href="/products" className="w-full">
            <Button variant="primary" className="w-full">
              SHOP BEST SELLERS
            </Button>
          </Link>
        </Card>

        <Card
          variant="elevated"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-2xl min-[501px]:text-3xl font-bold leading-tight">
              Gift Cards
            </h3>

            <p className="m-0 mb-2.5 text-sm min-[501px]:text-base leading-normal text-text-muted">
              Give the perfect gift to someone special.
            </p>
          </div>

          <Link href="/products" className="w-full">
            <Button variant="primary" className="w-full">
              BUY GIFT CARDS
            </Button>
          </Link>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-2xl min-[501px]:text-3xl font-bold leading-tight">
              Sale Items
            </h3>

            <p className="m-0 mb-2.5 text-sm min-[501px]:text-base leading-normal text-text-muted">
              Discover great deals on top products.
            </p>
          </div>

          <Link href="/products" className="w-full">
            <Button variant="primary" className="w-full">
              SHOP SALE
            </Button>
          </Link>
        </Card>

      </div>
    </section>
  );
}
