import { NextRequest, NextResponse } from 'next/server';
import { confirmSubscriber } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      );
    }

    // Verify token format (basic validation)
    // In production, you'd verify this against a signed token
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.email !== email || !decoded.exp || decoded.exp < Date.now()) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Confirm subscriber
    const subscriber = await confirmSubscriber(email);
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found or already confirmed' },
        { status: 404 }
      );
    }

    // Send welcome email
    await sendWelcomeEmail(email);

    // Redirect to success page or return success response
    return NextResponse.redirect(new URL('/?confirmed=true', request.url));
  } catch (error) {
    console.error('Newsletter confirm error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
