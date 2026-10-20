import { NextRequest, NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import { toClientSearchResult } from '@/lib/productAdapter';
import type { ProductSearchResultDto } from '@/types/ProductSearchResultDto';

/**
 * GET /api/products
 * Proxies request to .NET API /api/v1/Products/search with pagination, search, and filtering.
 * Transforms response into client-ready shape.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '12';
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
