import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscriberByEmail } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 'newsletter-subscribe', 5, 3600); // 5 requests per hour

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await getSubscriberByEmail(email);
    if (existingSubscriber?.status === 'active') {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      );
    }

    // Add subscriber
    const subscriber = await addSubscriber(email, 'website');
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Failed to add subscriber' },
        { status: 500 }
      );
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(email, subscriber.id);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent. Please check your inbox.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
