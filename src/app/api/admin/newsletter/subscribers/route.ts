import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/db';

/**
 * Admin endpoint to get all subscribers
 * Protected by environment variable check
 */
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    const validKeys = [process.env.ADMIN_API_KEY, process.env.NEXT_PUBLIC_ADMIN_PASSWORD].filter(Boolean);
    
    if (!adminKey || !validKeys.includes(adminKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscribers = await getAllSubscribers();

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('Admin subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
