# Supabase Newsletter Setup

## Prerequisites

- Supabase project created
- Environment variables configured in `.env.local`

## Environment Variables Required

```env
# Supabase URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://pskrwuehehykaolendkc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@dso.skycloudops.in
NEXT_PUBLIC_BASE_URL=https://dso.skycloudops.in

# Admin Access
ADMIN_API_KEY=your-secure-random-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

## Database Setup

### 1. Run Migration in Supabase

Go to your Supabase project dashboard:
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `migrations/001_create_newsletter_tables.sql`
4. Click **Run**

Or execute via CLI:
```bash
psql $DATABASE_URL < migrations/001_create_newsletter_tables.sql
```

### 2. Verify Tables Created

In Supabase dashboard, check **Table Editor**:
- `newsletter_subscribers`
- `newsletter_campaigns`
- `newsletter_logs`

All three tables should be visible with proper columns and indexes.

## API Endpoints

### Subscribe
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Response:
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

### Confirm Email
```
GET /api/newsletter/confirm?email=user@example.com&token=eyJ...
```

### Unsubscribe
```bash
curl -X POST http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Or via link:
```
GET /api/newsletter/unsubscribe?email=user@example.com
```

### Admin Stats
```bash
curl http://localhost:3000/api/admin/newsletter/stats \
  -H "x-admin-key: your-admin-api-key"
```

## Admin Dashboard

Access at: `http://localhost:3000/admin/newsletter`

**Login:**
- Enter your `NEXT_PUBLIC_ADMIN_PASSWORD` value
- View subscriber statistics
- Access admin tools (when implemented)

## Resend Email Configuration

1. Get your API key from [Resend](https://resend.com)
2. Set `RESEND_API_KEY` in `.env.local`
3. Verify email sending by subscribing on the website

Check Resend dashboard for email logs and delivery status.

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env.local` to version control
- Rotate database credentials regularly
- Use strong `ADMIN_API_KEY` and `NEXT_PUBLIC_ADMIN_PASSWORD`
- Enable Row Level Security (RLS) on Supabase tables for production
- Use Supabase's JWT tokens for API authentication

## RLS Setup (Optional but Recommended)

In Supabase SQL Editor:

```sql
-- Enable RLS on newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read their own data"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Allow service role to do everything
CREATE POLICY "Service role can do everything"
  ON newsletter_subscribers
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```

## Troubleshooting

### Email Not Sending

1. Check Resend API key is correct
2. Verify `RESEND_FROM_EMAIL` domain is verified in Resend
3. Check Resend dashboard for error logs
4. Verify `.env.local` has all required variables

### Subscribers Not Saving

1. Check Supabase service role key is correct
2. Verify tables exist in Supabase Table Editor
3. Check database connection in Supabase logs
4. Ensure migration ran successfully

### Admin Dashboard Access Denied

1. Verify `ADMIN_API_KEY` header is being sent
2. Check `ADMIN_API_KEY` value matches in `.env.local`
3. Clear browser cache and try again

## Next Steps

1. ✅ Database tables created
2. ✅ API routes configured
3. ✅ Email templates ready
4. ⏳ Implement campaign creation UI
5. ⏳ Setup email event tracking
6. ⏳ Implement campaign scheduler
