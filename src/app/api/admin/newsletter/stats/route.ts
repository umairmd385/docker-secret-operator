import { NextRequest, NextResponse } from 'next/server';
import { getActiveSubscribersCount, getPendingSubscribersCount } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin endpoint to get newsletter statistics
 * Protected by environment variable check
 */
export async function GET(request: NextRequest) {
  try {
    // Simple env-based protection - in production, use proper authentication
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const [active, pending] = await Promise.all([
      getActiveSubscribersCount(),
      getPendingSubscribersCount(),
    ]);

    // Get unsubscribed count
    const { count: unsubscribed, error: unsubError } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .in('status', ['unsubscribed', 'bounced', 'blocked']);

    if (unsubError) {
      console.error('Error getting unsubscribed count:', unsubError);
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }

    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Error getting total count:', totalError);
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      active,
      pending,
      unsubscribed: unsubscribed || 0,
      total: total || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
