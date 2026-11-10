import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { DOTNET_API_BASE_URL } from '@/config';
import { toDotnetProductPayload } from '@/utils/productAdapter';
import { getProductsServer } from '@/services/serverProductService';
import { parseProductSearchParams } from '@/utils/productParams';
import { ApiError } from '@/services/serverApi';
import type { ProductInput } from '@/types';

/**
 * GET /api/products
 * Proxies request through getProductsServer with pagination, search, and filtering.
 * Leverages shared Next.js 60s tagged cache and centralized parameter parser.
 */
export async function GET(request: NextRequest) {
  try {
    const { apiParams } = parseProductSearchParams(request.nextUrl.searchParams);
    const clientData = await getProductsServer(apiParams);

    return NextResponse.json(clientData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in GET /api/products handler:', error);
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : 'Upstream product service is unavailable';

    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * POST /api/products
 * Creates a new product. Requires Admin Bearer token.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate - Admin Bearer Token is required
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication token is required.' },
        { status: 401 }
      );
    }

    // 2. Parse and Validate Request Body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const { name, description, price, categoryId, brandId, rating } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Product name is required.' },
        { status: 400 }
      );
    }

    if (price === undefined || typeof price !== 'number' || isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'A valid positive price is required.' },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'number' || isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'A valid numeric categoryId is required.' },
        { status: 400 }
      );
    }

    if (!brandId || typeof brandId !== 'number' || isNaN(brandId)) {
      return NextResponse.json(
        { error: 'A valid numeric brandId is required.' },
        { status: 400 }
      );
    }

    // 3.  Create Product Shell in .NET API using reverse adapter
    const createDto: ProductInput = {
      name,
      description,
      price,
      categoryId,
      brandId,
      rating,
    };
    const productPayload = toDotnetProductPayload(createDto);

    const productResponse = await fetch(`${DOTNET_API_BASE_URL}/api/v1/Products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(productPayload),
      cache: 'no-store',
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      console.error(
        `Upstream error creating product [${productResponse.status}]: ${errorText}`
      );
      return NextResponse.json(
        {
          error:
            productResponse.status === 401 || productResponse.status === 403
              ? 'Forbidden: Admin access required.'
              : 'Failed to create product in upstream service.',
        },
        { status: productResponse.status }
      );
    }

    const productResult = await productResponse.json();
    const createdProductId = productResult?.productId;

    if (!createdProductId) {
      return NextResponse.json(
        { error: 'Upstream service did not return a valid productId.' },
        { status: 502 }
      );
    }

    // 4 Create Product Price in .NET API
    const pricePayload = {
      productId: createdProductId,
      price: Number(price),
    };

    const priceResponse = await fetch(`${DOTNET_API_BASE_URL}/api/ProductPrices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(pricePayload),
      cache: 'no-store',
    });

    // 5. Rollback Safety: If Price creation fails, delete the created product
    if (!priceResponse.ok) {
      const priceErrorText = await priceResponse.text();
      console.error(
        `Upstream error creating product price for #${createdProductId} [${priceResponse.status}]: ${priceErrorText}`
      );

      try {
        await fetch(`${DOTNET_API_BASE_URL}/api/v1/Products/${createdProductId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader,
          },
        });
        console.warn(`Rollback successful: deleted orphan product #${createdProductId}`);
      } catch (rollbackErr) {
        console.error(`Rollback failed for product #${createdProductId}:`, rollbackErr);
      }

      return NextResponse.json(
        {
          error:
            'Failed to set product price. The product was rolled back to prevent catalog errors.',
        },
        { status: 502 }
      );
    }

    // 6. Return unified client Product shape
    const newProduct = {
      id: createdProductId,
      name: productPayload.name,
      description: productPayload.description,
      price: Number(price),
      imageUrl: '',
      categoryId: productPayload.categoryId,
      category: '',
      brandId: productPayload.brandId,
      brand: '',
      rating: productPayload.rating,
    };

    // Invalidate product catalog cache and pages across the application
    revalidateTag('products', 'max');
    revalidatePath('/products');
    revalidatePath('/');

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products handler:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating product.' },
      { status: 500 }
    );
  }
}

