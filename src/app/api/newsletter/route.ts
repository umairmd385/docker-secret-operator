import { NextRequest, NextResponse } from 'next/server';

/**
 * Legacy newsletter endpoint — redirects to /api/newsletter/subscribe
 * This file is kept for backwards compatibility only.
 */
export async function POST(request: NextRequest) {
  // Forward all POST requests to the new subscribe endpoint
  const body = await request.json();

  const response = await fetch(
    `${request.nextUrl.origin}/api/newsletter/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json(
    await response.json(),
    { status: response.status }
  );
}
