import { getCategoriesServer } from '@/services/serverProductService';
import ShopByCategory from '@/components/product/ShopByCategory';
import StateMessage from '@/components/common/StateMessage';
import type { Category } from '@/types';

/**
 * Async Server Component for Shop By Category.
 * Fetches categories on the server and streams independently inside a Suspense boundary.
 * Renders unified StateMessage on failure.
 */
export default async function ShopByCategorySection() {
  let categories: Category[] | null = null;
  let hasError = false;

  try {
    categories = await getCategoriesServer();
  } catch (error) {
    console.error('[CATEGORIES] Failed to load:', error);
    hasError = true;
  }

  if (hasError || !categories) {
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

  return <ShopByCategory categories={categories} />;
}
