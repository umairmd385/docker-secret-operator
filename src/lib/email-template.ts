/**
 * DEPRECATED: This file is no longer used.
 * Email templates have been migrated to src/lib/email.ts with Resend integration.
 *
 * Legacy implementation details:
 * - Used nodemailer with Gmail SMTP
 * - Used Redis for subscriber tracking
 *
 * New implementation:
 * - Uses Resend for transactional email
 * - Uses Supabase PostgreSQL for subscriber data
 *
 * This file is kept for reference only and can be safely deleted.
 */
