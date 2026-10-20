import { NextRequest, NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import { toClientProduct } from '@/lib/productAdapter';
import type { ProductDto } from '@/types/ProductDto';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]
 * Proxies request to .NET API /api/v1/Products/{id}
 * Returns clean Product model or 404 Not Found.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID. Must be a numeric value.' },
        { status: 400 }
      );
    }

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/${id}`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
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
        `Upstream error fetching product ${id} [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        { error: 'Failed to retrieve product from upstream service' },
        { status: response.status }
      );
    }

    const data: ProductDto = await response.json();
    const clientProduct = toClientProduct(data);

    return NextResponse.json(clientProduct, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products/[id] handler:', error);
    return NextResponse.json(
      { error: 'Upstream product service is unavailable' },
      { status: 502 }
    );
  }
}
