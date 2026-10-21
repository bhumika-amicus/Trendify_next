import { NextRequest, NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';

/**
 * POST /api/auth/login
 * Proxies login credentials to .NET API /api/auth/login.
 * Returns JWT token, refreshToken, customerId, name, and role.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/auth/login`;

    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upstream auth error [${response.status}]: ${errorText}`
      );
      return NextResponse.json(
        {
          error:
            response.status === 401
              ? 'Invalid email or password.'
              : 'Authentication service failed.',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/auth/login handler:', error);
    return NextResponse.json(
      { error: 'Authentication service is unavailable.' },
      { status: 502 }
    );
  }
}
