import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscribers, updateSubscriberStatus, deleteSubscriber } from '@/lib/db';

const authenticate = (request: NextRequest) => {
  const adminKey = request.headers.get('x-admin-key');
  const validKeys = [process.env.ADMIN_API_KEY, process.env.NEXT_PUBLIC_ADMIN_PASSWORD].filter(Boolean);
  return adminKey && validKeys.includes(adminKey);
};
/**
 * Admin endpoint to get all subscribers
 * Protected by environment variable check
 */
export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

export async function PATCH(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    
    const success = await updateSubscriberStatus(id, status);
    if (success) {
      return NextResponse.json({ message: 'Status updated' });
    }
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const success = await deleteSubscriber(id);
    if (success) {
      return NextResponse.json({ message: 'Subscriber deleted' });
    }
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
