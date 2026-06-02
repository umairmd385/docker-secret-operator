import { NextRequest, NextResponse } from 'next/server';
import { getAllCampaigns, createCampaign, getActiveSubscribers, logNewsletterSend } from '@/lib/db';
import { sendNewsletterCampaign } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

// Authentication helper
const authenticate = (request: NextRequest) => {
  const adminKey = request.headers.get('x-admin-key');
  const validKeys = [process.env.ADMIN_API_KEY, process.env.NEXT_PUBLIC_ADMIN_PASSWORD].filter(Boolean);
  return adminKey && validKeys.includes(adminKey);
};

export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await getAllCampaigns();
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, subject, content } = await request.json();

    if (!title || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the campaign in the database
    const campaign = await createCampaign(title, subject, { html: content }, 'update');
    
    if (!campaign) {
      return NextResponse.json({ error: 'Failed to create campaign record' }, { status: 500 });
    }

    // 2. Fetch all active subscribers
    const subscribers = await getActiveSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ 
        message: 'Campaign created but no active subscribers found', 
        campaign 
      });
    }

    // 3. Send emails to all active subscribers asynchronously (fire and forget for MVP to avoid timeout)
    // In a real robust system, this should be a queue or edge function.
    const sendEmails = async () => {
      for (const subscriber of subscribers) {
        try {
          const success = await sendNewsletterCampaign(
            subscriber.email,
            subject,
            content,
            subscriber.email // unsubscribe email
          );
          
          await logNewsletterSend(
            subscriber.id,
            campaign.id,
            null,
            success ? 'sent' : 'failed'
          );
        } catch (err) {
          console.error(`Failed to send campaign to ${subscriber.email}:`, err);
        }
      }
      
      // Update campaign status to sent
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );
      await supabase
        .from('newsletter_campaigns')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', campaign.id);
    };

    // Execute synchronously so Vercel doesn't kill the function early
    await sendEmails();

    return NextResponse.json({ 
      message: `Campaign created and sent to ${subscribers.length} subscribers!`,
      campaign 
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
