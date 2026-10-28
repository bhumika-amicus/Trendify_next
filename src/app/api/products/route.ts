import { NextRequest, NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import { toClientSearchResult, toDotnetCreatePayload } from '@/lib/productAdapter';
import type { ProductSearchResultDto, CreateProductDto } from '@/types';

/**
 * GET /api/products
 * Proxies request to .NET API /api/v1/Products/search with pagination, search, and filtering.
 * Transforms response into client-ready shape.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const parsedPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const parsedPageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '12', 10) || 12)
    );

    const page = String(parsedPage);
    const pageSize = String(parsedPageSize);
    const search = searchParams.get('search')?.trim();
    const categoryId = searchParams.get('categoryId');
    const brandId = searchParams.get('brandId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    // Build query parameters for .NET API (PascalCase as expected by .NET)
    const upstreamParams = new URLSearchParams();
    upstreamParams.set('Page', page);
    upstreamParams.set('PageSize', pageSize);

    if (search) upstreamParams.set('Search', search);
    if (categoryId) upstreamParams.set('CategoryId', categoryId);
    if (brandId) upstreamParams.set('BrandId', brandId);
    if (minPrice) upstreamParams.set('MinPrice', minPrice);
    if (maxPrice) upstreamParams.set('MaxPrice', maxPrice);
    if (minRating) upstreamParams.set('MinRating', minRating);
    if (sortBy) upstreamParams.set('SortBy', sortBy);
    if (sortOrder) upstreamParams.set('SortOrder', sortOrder);

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/v1/Products/search?${upstreamParams.toString()}`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Ensure Next.js doesn't aggressively cache dynamic search queries
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream .NET API error [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        {
          error:
            response.status === 404
              ? 'No products found'
              : 'Failed to fetch products from upstream service',
        },
        { status: response.status }
      );
    }

    const data: ProductSearchResultDto = await response.json();
    const clientData = toClientSearchResult(data);

    return NextResponse.json(clientData, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products handler:', error);
    return NextResponse.json(
      { error: 'Upstream product service is unavailable' },
      { status: 502 }
    );
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
    const createDto: CreateProductDto = {
      name,
      description,
      price,
      categoryId,
      brandId,
      rating,
    };
    const productPayload = toDotnetCreatePayload(createDto);

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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products handler:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating product.' },
      { status: 500 }
    );
  }
}

