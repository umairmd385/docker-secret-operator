import { NextRequest, NextResponse } from 'next/server';
import { buildNewsletterTemplate } from '@/lib/email';

const authenticate = (request: NextRequest) => {
  const adminKey = request.headers.get('x-admin-key');
  const validKeys = [process.env.ADMIN_API_KEY, process.env.NEXT_PUBLIC_ADMIN_PASSWORD].filter(Boolean);
  return adminKey && validKeys.includes(adminKey);
};

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    // Dummy email for unsubscribe link preview
    const dummyEmail = 'preview@skycloudops.in';
    const html = buildNewsletterTemplate(content, dummyEmail);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
