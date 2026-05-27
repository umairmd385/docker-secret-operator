-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed', 'blocked', 'bounced')),
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for newsletter_subscribers
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);

-- Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'archived')),
  campaign_type VARCHAR(50) NOT NULL DEFAULT 'update' CHECK (campaign_type IN ('update', 'provider', 'docs', 'security', 'community')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for newsletter_campaigns
CREATE INDEX idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX idx_newsletter_campaigns_created_at ON newsletter_campaigns(created_at);
CREATE INDEX idx_newsletter_campaigns_sent_at ON newsletter_campaigns(sent_at);

-- Create newsletter_logs table
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  provider_message_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for newsletter_logs
CREATE INDEX idx_newsletter_logs_subscriber_id ON newsletter_logs(subscriber_id);
CREATE INDEX idx_newsletter_logs_campaign_id ON newsletter_logs(campaign_id);
CREATE INDEX idx_newsletter_logs_status ON newsletter_logs(status);
CREATE INDEX idx_newsletter_logs_created_at ON newsletter_logs(created_at);
CREATE INDEX idx_newsletter_logs_subscriber_campaign ON newsletter_logs(subscriber_id, campaign_id);

-- Create unique constraint to prevent duplicate subscriptions per campaign
CREATE UNIQUE INDEX idx_newsletter_logs_unique_subscriber_campaign ON newsletter_logs(subscriber_id, campaign_id);
