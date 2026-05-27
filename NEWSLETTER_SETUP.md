# Newsletter System Setup Guide

## Installation

### 1. Install Required Packages

```bash
npm install @supabase/supabase-js resend
```

### 2. Environment Variables

Copy and update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email Service
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Admin Panel
ADMIN_API_KEY=generate-a-secure-random-key
NEXT_PUBLIC_ADMIN_PASSWORD=choose-a-strong-password
```

**How to get these values:**

**Supabase:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy `Project URL` and `anon` key
5. For service role key, click "Reveal" under service_role

**Resend:**
1. Go to [Resend](https://resend.com)
2. Click **API Keys** in sidebar
3. Copy your API key
4. Add and verify your sender domain

### 3. Database Migration

See `SUPABASE_SETUP.md` for detailed database setup.

Quick start:
```bash
# Option 1: Via Supabase Dashboard
# Copy migrations/001_create_newsletter_tables.sql to SQL Editor and run

# Option 2: Via CLI
psql $DATABASE_URL < migrations/001_create_newsletter_tables.sql
```

### 4. Verify Setup

Test the subscribe endpoint:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

Check Resend dashboard for the verification email.

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── newsletter/
│   │       ├── subscribe/route.ts      # POST /api/newsletter/subscribe
│   │       ├── confirm/route.ts        # GET /api/newsletter/confirm
│   │       └── unsubscribe/route.ts    # POST/GET /api/newsletter/unsubscribe
│   ├── admin/
│   │   └── newsletter/page.tsx         # Admin dashboard
│   └── docs/
│       └── layout.tsx                  # (Existing)
├── lib/
│   ├── db.ts                           # Database operations
│   ├── email.ts                        # Email templates and sending
│   ├── rate-limit.ts                   # Rate limiting
│   ├── links.ts                        # Route definitions
│   └── ...
└── components/
    └── layout/
        └── Footer.tsx                  # Updated with newsletter form

migrations/
└── 001_create_newsletter_tables.sql    # Database schema
```

---

## API Documentation

### Subscribe to Newsletter

**Endpoint:** `POST /api/newsletter/subscribe`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Responses:**
- `201`: Verification email sent
- `200`: Already subscribed
- `400`: Invalid email
- `429`: Too many requests (rate limited)
- `500`: Server error

### Confirm Email

**Endpoint:** `GET /api/newsletter/confirm`

**Query Parameters:**
- `email`: Subscriber email
- `token`: Verification token (generated on subscribe)

**Responses:**
- `200`: Email confirmed, welcome email sent
- `400`: Invalid token
- `404`: Subscriber not found

### Unsubscribe

**Endpoint:** `POST /api/newsletter/unsubscribe`

**Request:**
```json
{
  "email": "user@example.com"
}
```

Or via link: `GET /api/newsletter/unsubscribe?email=user@example.com`

**Responses:**
- `200`: Successfully unsubscribed
- `400`: Missing email

### Admin Stats

**Endpoint:** `GET /api/admin/newsletter/stats`

**Headers:**
```
x-admin-key: your-admin-api-key
```

**Response:**
```json
{
  "active": 150,
  "pending": 23,
  "unsubscribed": 5,
  "total": 178
}
```

---

## Database Schema

### newsletter_subscribers
- `id` (UUID): Primary key
- `email` (VARCHAR): Unique email address
- `status` (VARCHAR): 'pending' | 'active' | 'unsubscribed' | 'blocked' | 'bounced'
- `source` (VARCHAR): Where subscription came from (e.g., 'website')
- `confirmed_at` (TIMESTAMP): When email was confirmed
- `unsubscribed_at` (TIMESTAMP): When unsubscribed
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### newsletter_campaigns
- `id` (UUID): Primary key
- `title` (VARCHAR): Campaign title
- `subject` (VARCHAR): Email subject line
- `content` (JSONB): HTML email content
- `status` (VARCHAR): 'draft' | 'scheduled' | 'sent' | 'archived'
- `campaign_type` (VARCHAR): 'update' | 'provider' | 'docs' | 'security' | 'community'
- `scheduled_at` (TIMESTAMP): When to send
- `sent_at` (TIMESTAMP): When sent
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### newsletter_logs
- `id` (UUID): Primary key
- `subscriber_id` (UUID): FK to newsletter_subscribers
- `campaign_id` (UUID): FK to newsletter_campaigns
- `provider_message_id` (VARCHAR): Email provider's message ID
- `status` (VARCHAR): 'pending' | 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked'
- `sent_at` (TIMESTAMP): When email was sent
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

## Features Implemented

✅ **Phase 1:** Footer refactor with new newsletter messaging
✅ **Phase 2:** Supabase database with 3 tables and indexes
✅ **Phase 3:** Subscribe, confirm, unsubscribe API routes with rate limiting
✅ **Phase 4:** Email templates (verification, welcome, campaign)
✅ **Phase 5:** Admin dashboard with stats and password protection
✅ **Phase 7:** Legacy claim cleanup (MIT → Apache 2.0)

⏳ **Phase 6:** Campaign creation and scheduling
⏳ **Phase 8:** Full QA and testing

---

## Troubleshooting

### Email not sending?
1. Check RESEND_API_KEY is correct
2. Verify sender domain is confirmed in Resend
3. Check Resend dashboard for error logs
4. Ensure RESEND_FROM_EMAIL matches verified domain

### Subscribers not saving?
1. Verify Supabase connection strings
2. Confirm migration ran successfully
3. Check Supabase logs for errors
4. Verify service role key has database access

### Admin panel password not working?
1. Check NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
2. Clear browser session storage
3. Try in incognito window
4. Verify no typos in password

---

## Security Checklist

- [ ] Rotate database credentials after sharing
- [ ] Use strong ADMIN_API_KEY and NEXT_PUBLIC_ADMIN_PASSWORD
- [ ] Enable Supabase RLS policies (optional but recommended)
- [ ] Never commit .env.local to git
- [ ] Keep Resend API key secret
- [ ] Monitor admin dashboard access
- [ ] Implement proper authentication for production admin panel
- [ ] Enable email verification before adding to campaigns

---

## Next Steps

1. Complete Phase 6: Campaign creation UI
2. Add email event tracking (opens, clicks)
3. Implement scheduled campaign sending
4. Setup email bouncing/complaint handling
5. Add subscriber segmentation/tagging
6. Implement template library
7. Add A/B testing capabilities
