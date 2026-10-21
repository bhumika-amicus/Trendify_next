import { NextRequest, NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';

/**
 * POST /api/auth/refresh
 * Proxies refreshToken to .NET API /api/auth/refresh to rotate expired JWT.
 * Returns renewed token, refreshToken, customerId, name, and role.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body || {};

    if (!refreshToken || typeof refreshToken !== 'string') {
      return NextResponse.json(
        { error: 'Valid refreshToken is required.' },
        { status: 400 }
      );
    }

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/auth/refresh`;

    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Upstream refresh token error [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        { error: 'Invalid or expired refresh token. Please sign in again.' },
        { status: response.status === 400 || response.status === 401 ? 401 : response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/auth/refresh handler:', error);
    return NextResponse.json(
      { error: 'Authentication service is unavailable.' },
      { status: 502 }
    );
  }
}
