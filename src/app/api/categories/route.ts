import { NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import type { CategoryDto } from '@/types/CategoryDto';
import type { Category } from '@/types/Categories';

export async function GET() {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Categories?api-version=1`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve categories from upstream' },
        { status: response.status }
      );
    }

    const data: CategoryDto[] = await response.json();
    const categories: Category[] = (data || []).map((c) => ({
      id: c.categoryId,
      name: c.name,
    }));

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/categories handler:', error);
    return NextResponse.json(
      { error: 'Upstream categories service is unavailable' },
      { status: 502 }
    );
  }
}
