import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

/**
 * Send a test email
 */
export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    const validKeys = [process.env.ADMIN_API_KEY, process.env.NEXT_PUBLIC_ADMIN_PASSWORD].filter(Boolean);
    
    if (!adminKey || !validKeys.includes(adminKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const success = await sendEmail({
      to: email,
      subject: 'Test Email - Docker Secret Operator',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email Successful!</h2>
          <p>If you are receiving this, your email configuration (Resend/Gmail) is working perfectly.</p>
          <p>You can now safely send newsletter campaigns.</p>
        </div>
      `,
    });

    if (success) {
      return NextResponse.json({ message: 'Test email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
