import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { DOTNET_API_BASE_URL } from '@/config';
import { toDotnetProductPayload } from '@/utils/productAdapter';
import { getProductByIdServer } from '@/services/serverProductService';
import { ApiError } from '@/services/serverApi';
import type { ProductInput } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]
 * Delegates to getProductByIdServer with shared caching and tag invalidation.
 * Returns clean Product model or 404 Not Found.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!productId || isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { error: 'Invalid product ID. Must be a numeric value.' },
        { status: 400 }
      );
    }

    const product = await getProductByIdServer(productId);

    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${id} was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in GET /api/products/[id] handler:', error);
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : 'Upstream product service is unavailable';

    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * PUT /api/products/[id]
 * Updates product details. Requires Admin Bearer token.
 * Proxies request to .NET API /api/v1/Products/{id}.
 * Returns 204 No Content on success.
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID. Must be a numeric value.' },
        { status: 400 }
      );
    }

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

    const { name, description, categoryId, brandId, rating } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Product name is required.' },
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

    // 3. Send PUT to .NET API using reverse adapter
    const updateDto: ProductInput = {
      name,
      description,
      categoryId,
      brandId,
      rating,
    };
    const updatePayload = toDotnetProductPayload(updateDto);

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/${id}`;

    const response = await fetch(upstreamUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(updatePayload),
      cache: 'no-store',
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Product with ID ${id} was not found.` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream error updating product ${id} [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        {
          error:
            response.status === 401 || response.status === 403
              ? 'Forbidden: Admin access required.'
              : 'Failed to update product in upstream service.',
        },
        { status: response.status }
      );
    }

    // Invalidate product cache tags and HTML page cache across the application
    revalidateTag('products', 'max');
    revalidateTag(`product-${id}`, 'max');
    revalidatePath(`/products/${id}`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in PUT /api/products/[id] handler:', error);
    return NextResponse.json(
      { error: 'Upstream product service is unavailable' },
      { status: 502 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes a product. Requires Admin Bearer token.
 * Proxies request to .NET API /api/v1/Products/{id}.
 * Returns 204 No Content on success, or 404 if not found.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID. Must be a numeric value.' },
        { status: 400 }
      );
    }

    // 1. Authenticate - Admin Bearer Token is required
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication token is required.' },
        { status: 401 }
      );
    }

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/${id}`;

    const response = await fetch(upstreamUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Product with ID ${id} was not found.` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream error deleting product ${id} [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        {
          error:
            response.status === 401 || response.status === 403
              ? 'Forbidden: Admin access required.'
              : 'Failed to delete product from upstream service.',
        },
        { status: response.status }
      );
    }

    // Invalidate product cache tags and HTML page cache across the application
    revalidateTag('products', 'max');
    revalidateTag(`product-${id}`, 'max');
    revalidatePath(`/products/${id}`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id] handler:', error);
    return NextResponse.json(
      { error: 'Upstream product service is unavailable' },
      { status: 502 }
    );
  }
}

