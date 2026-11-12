import { getCategoriesServer } from '@/services/serverProductService';
import ShopByCategory from './ShopByCategory';
import StateMessage from '@/components/common/StateMessage';

/**
 * Async Server Component for Shop by Category section.
 * Fetches categories on the server and streams independently inside a Suspense boundary.
 * Renders an inline error state if the service is down, or an empty state if no categories exist.
 */
export default async function ShopByCategorySection() {
  const categories = await getCategoriesServer();

  if (categories === null) {
    return (
      <section className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8">
        <div className="section-heading mb-6!">
          <h2>Shop by Category</h2>
        </div>
        <StateMessage
          title="Unable to load categories"
          message="We're having trouble connecting to our servers right now. Please try again."
          buttonText="Retry"
          actionHref="/"
          variant="error"
          compact
        />
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="mx-auto max-w-350 px-12 pt-2 pb-12 max-[650px]:px-4.5 max-[650px]:pt-1 max-[650px]:pb-8">
        <div className="section-heading mb-6!">
          <h2>Shop by Category</h2>
        </div>
        <StateMessage
          title="No categories available"
          message="No categories are available at the moment. Please check back later."
          buttonText="Browse Products"
          actionHref="/products"
          variant="empty"
          compact
        />
      </section>
    );
  }

  return <ShopByCategory categories={categories} />;
}
