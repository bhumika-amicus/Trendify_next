import {
  getCategoriesServer,
  getBrandsServer,
} from '@/services/serverProductService';
import FilterSidebar from './FilterSidebar';

/**
 * Async Server Component for the store filter sidebar.
 * Fetches categories and brands on the server and streams
 * independently inside a <Suspense> boundary without blocking the product grid.
 */
export default async function FilterSidebarSection() {
  const [categories, brands] = await Promise.all([
    getCategoriesServer(),
    getBrandsServer(),
  ]);

  return <FilterSidebar categories={categories} brands={brands} />;
}
