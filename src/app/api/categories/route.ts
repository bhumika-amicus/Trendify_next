import { NextResponse } from 'next/server';
import { getCategoriesServer } from '@/services/serverProductService';

/**
 * GET /api/categories
 * Delegates to getCategoriesServer with 300s shared tagged cache.
 */
export async function GET() {
  try {
    const categories = await getCategoriesServer();

    if (!categories) {
      return NextResponse.json(
        { error: 'Upstream categories service is unavailable' },
        { status: 502 }
      );
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/categories handler:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve categories' },
      { status: 500 }
    );
  }
}
