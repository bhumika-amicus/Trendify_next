import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getProductByIdServer,
  getProductsServer,
} from '@/services/serverProductService';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import StateMessage from '@/components/common/StateMessage';
import RatingStars from '@/components/common/RatingStars';
import ProductAddToCart from '@/components/product/ProductAddToCart';
import { formatINR } from '@/utils/formatters';

// Enable Incremental Static Regeneration (ISR) with a 60-second window
export const revalidate = 60;

/**
 * Pre-generate static pages for products at build time (SSG).
 * Products not returned here will be generated on demand via dynamicParams (ISR).
 */
export async function generateStaticParams() {
  try {
    const { products } = await getProductsServer({ pageSize: 50 });
    return (products || []).map((product) => ({
      id: String(product.id),
    }));
  } catch (error) {
    console.error('Error pre-generating static params for products:', error);
    return [];
  }
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  if (!productId || isNaN(productId) || productId <= 0) {
    return {
      title: 'Product Not Found | Trendify',
    };
  }

  const { product } = await getProductByIdServer(productId);
  if (!product) {
    return {
      title: 'Product Not Found | Trendify',
    };
  }

  return {
    title: `${product.name} | Trendify`,
    description:
      product.description ||
      `Buy ${product.name} at Trendify for ${formatINR(product.price)}. Fast delivery and guaranteed authenticity.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id);

  // 1. Validation: IDs must be positive integers
  if (!productId || isNaN(productId) || productId <= 0) {
    notFound();
  }

  // 2. Fetch product data on the server
  const { product, status, error } = await getProductByIdServer(productId);

  // 3. 404 Guard: Product does not exist
  if (status === 404 || (!product && !error)) {
    notFound();
  }

  // 4. 500 / Network Error Guard: Upstream service failure
  if (error && !product) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-12 sm:px-6 md:px-10">
        <StateMessage
          title="Unable to load product"
          message={error}
          variant="error"
        >
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/products/${productId}`}>
              <Button variant="outline">Try Again</Button>
            </Link>
            <Link href="/products">
              <Button variant="primary">Return to Products</Button>
            </Link>
          </div>
        </StateMessage>
      </div>
    );
  }

  // Guard TypeScript type check
  if (!product) {
    notFound();
  }

  const imageSrc = product.imageUrl || '/placeholder.jpg';
  const isExternalImage = Boolean(
    product.imageUrl &&
      product.imageUrl.startsWith('http') &&
      !product.imageUrl.includes('images.unsplash.com')
  );

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10">
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Products', path: '/products' },
          { label: product.name },
        ]}
      />

      <Card variant="elevated" className="mt-6 p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Image Display */}
          <div className="relative flex flex-1 items-center justify-center rounded border border-gray-100 bg-surface-muted p-8 md:p-12 min-h-80 md:min-h-100">
            <Image
              src={imageSrc}
              alt={product.name}
              width={400}
              height={400}
              className="max-h-100 w-full object-contain mix-blend-multiply"
              priority
              unoptimized={isExternalImage}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-1 flex-col justify-center">
            <span className="mb-2 text-sm font-bold tracking-wider text-brand-orange uppercase">
              {product.category}
            </span>

            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mb-4 text-gray-500">
              Brand: {product.brand}
            </p>

            {product.rating !== undefined && (
              <RatingStars
                rating={product.rating}
                size="md"
                scoreFormat="fraction"
                className="mb-6"
              />
            )}

            <p className="mb-6 text-3xl font-bold text-gray-900">
              {formatINR(product.price)}
            </p>

            <hr className="mb-6 border-gray-200" />

            <h3 className="mb-2 font-bold text-gray-900">Product Description</h3>
            <p className="mb-8 text-gray-600 leading-relaxed">
              {product.description || 'No description available for this product.'}
            </p>

            {/* Interactive Client Island */}
            <ProductAddToCart product={product} />
          </div>
        </div>
      </Card>
    </div>
  );
}
