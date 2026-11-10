import { NextResponse } from 'next/server';
import { getBrandsServer } from '@/services/serverProductService';

/**
 * GET /api/brands
 * Delegates to getBrandsServer with 300s shared tagged cache.
 */
export async function GET() {
  try {
    const brands = await getBrandsServer();

    if (!brands) {
      return NextResponse.json(
        { error: 'Upstream brands service is unavailable' },
        { status: 502 }
      );
    }

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/brands handler:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve brands' },
      { status: 500 }
    );
  }
}
