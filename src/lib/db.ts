import { createClient } from '@supabase/supabase-js';

/**
 * Newsletter database operations
 * Uses Supabase Postgres for subscriber and campaign management
 *
 * This module uses the service role key for admin/internal operations.
 * It's called only from API routes in a server context.
 */

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey);
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'blocked' | 'bounced';
  source: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: Record<string, any>;
  status: 'draft' | 'scheduled' | 'sent' | 'archived';
  campaign_type: 'update' | 'provider' | 'docs' | 'security' | 'community';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterLog {
  id: string;
  subscriber_id: string;
  campaign_id: string;
  provider_message_id: string | null;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked';
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Add a new newsletter subscriber
 */
export async function addSubscriber(email: string, source: string = 'website'): Promise<NewsletterSubscriber | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase(),
          status: 'pending',
          source,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error adding subscriber:', error);
      return null;
    }

    return data as NewsletterSubscriber;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return null;
  }
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error getting subscriber:', error);
      return null;
    }

    return data as NewsletterSubscriber;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    return null;
  }
}

/**
 * Confirm subscriber email
 */
export async function confirmSubscriber(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'active',
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      console.error('Error confirming subscriber:', error);
      return null;
    }

    return data as NewsletterSubscriber;
  } catch (error) {
    console.error('Error confirming subscriber:', error);
    return null;
  }
}

/**
 * Unsubscribe email
 */
export async function unsubscribeEmail(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) {
      console.error('Error unsubscribing:', error);
      return null;
    }

    return data as NewsletterSubscriber;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return null;
  }
}

/**
 * Get active subscribers count
 */
export async function getActiveSubscribersCount(): Promise<number> {
  try {
    const supabase = getServiceRoleClient();
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      console.error('Error getting subscriber count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
}

/**
 * Get pending subscribers count
 */
export async function getPendingSubscribersCount(): Promise<number> {
  try {
    const supabase = getServiceRoleClient();
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting pending count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting pending count:', error);
    return 0;
  }
}

/**
 * Create a newsletter campaign
 */
export async function createCampaign(
  title: string,
  subject: string,
  content: Record<string, any>,
  campaign_type: string = 'update'
): Promise<NewsletterCampaign | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert({
        title,
        subject,
        content,
        campaign_type,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      return null;
    }

    return data as NewsletterCampaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(id: string): Promise<NewsletterCampaign | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting campaign:', error);
      return null;
    }

    return data as NewsletterCampaign;
  } catch (error) {
    console.error('Error getting campaign:', error);
    return null;
  }
}

/**
 * Get all campaigns (Admin only)
 */
export async function getAllCampaigns(): Promise<NewsletterCampaign[]> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting campaigns:', error);
      return [];
    }

    return data as NewsletterCampaign[];
  } catch (error) {
    console.error('Error getting campaigns:', error);
    return [];
  }
}


/**
 * Get all active subscribers for sending
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting active subscribers:', error);
      return [];
    }

    return data as NewsletterSubscriber[];
  } catch (error) {
    console.error('Error getting active subscribers:', error);
    return [];
  }
}

/**
 * Get all subscribers (Admin only)
 */
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all subscribers:', error);
      return [];
    }

    return data as NewsletterSubscriber[];
  } catch (error) {
    console.error('Error getting all subscribers:', error);
    return [];
  }
}


/**
 * Log newsletter send
 */
export async function logNewsletterSend(
  subscriber_id: string,
  campaign_id: string,
  provider_message_id: string | null = null,
  status: string = 'sent'
): Promise<NewsletterLog | null> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('newsletter_logs')
      .insert({
        subscriber_id,
        campaign_id,
        provider_message_id,
        status,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging newsletter send:', error);
      return null;
    }

    return data as NewsletterLog;
  } catch (error) {
    console.error('Error logging newsletter send:', error);
    return null;
  }
}
