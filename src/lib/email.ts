import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Get Gmail transporter (lazy initialization)
 */
function getGmailTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    throw new Error('Missing Gmail credentials: GMAIL_USER or GMAIL_PASS');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
}

/**
 * Send email via Resend or Gmail
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // If Resend API key is available, use Resend API
    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@skycloudops.in';
      const from = `"Docker Secret Operator" <${fromEmail}>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from,
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Resend API error:', errorText);
        return false;
      }
      return true;
    }

    // Fallback to Gmail
    const transporter = getGmailTransporter();

    const result = await transporter.sendMail({
      from: `"DSO" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (!result.messageId) {
      console.error('Email send failed: no message ID returned');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Generate verification token
 */
function generateVerificationToken(email: string, expiresIn: number = 3600000): string {
  const tokenData = {
    email,
    exp: Date.now() + expiresIn,
  };
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(email: string, subscriberId: string): Promise<boolean> {
  const token = generateVerificationToken(email);
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dso.skycloudops.in'}/api/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0ea5e9;
      margin: 0;
    }
    .content {
      padding: 30px 0;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: #1a1a1a;
    }
    .subtitle {
      font-size: 14px;
      color: #666;
      margin: 0 0 20px 0;
    }
    p {
      margin: 15px 0;
      color: #555;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #0ea5e9;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #0284c7;
    }
    .footer {
      padding: 20px 0;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .footer-link {
      color: #0ea5e9;
      text-decoration: none;
    }
    .trust-row {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 20px 0;
      font-size: 12px;
      color: #666;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 class="logo">DSO</h2>
      <p class="subtitle">Docker Secret Operator</p>
    </div>

    <div class="content">
      <h1>Welcome to DSO</h1>
      <p>Thanks for joining the DSO community.</p>

      <p>DSO helps Docker teams manage secrets, provider integrations, runtime rotation, and recovery workflows.</p>

      <p><strong>Please confirm your email address to get started:</strong></p>

      <div class="button-container">
        <a href="${verificationUrl}" class="button">Confirm Email</a>
      </div>

      <p style="font-size: 12px; color: #999;">
        Or copy and paste this link in your browser:<br>
        <code style="word-break: break-all;">${verificationUrl}</code>
      </p>

      <h3 style="margin-top: 30px; font-size: 16px;">Quick Start</h3>
      <p style="font-family: monospace; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        docker dso init<br>
        docker dso secret set DB_PASSWORD<br>
        docker dso up
      </p>

      <h3 style="margin-top: 20px; font-size: 16px;">Helpful Links</h3>
      <ul style="padding-left: 20px;">
        <li><a href="https://dso.skycloudops.in/docs" style="color: #0ea5e9; text-decoration: none;">Documentation</a></li>
        <li><a href="https://github.com/docker-secret-operator/dso" style="color: #0ea5e9; text-decoration: none;">GitHub</a></li>
        <li><a href="https://github.com/docker-secret-operator/dso/discussions" style="color: #0ea5e9; text-decoration: none;">Discussions</a></li>
      </ul>
    </div>

    <div class="trust-row">
      <span>Open Source</span>
      <span>•</span>
      <span>Docker Native</span>
      <span>•</span>
      <span>CNCF Sandbox</span>
    </div>

    <div class="footer">
      <p>
        <a href="https://dso.skycloudops.in/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" class="footer-link">Unsubscribe</a>
      </p>
      <p style="margin: 10px 0 0 0;">
        Docker Secret Operator<br>
        CNCF Sandbox Project • Apache 2.0 Licensed
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Confirm your email - Docker Secret Operator',
    html,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0ea5e9;
      margin: 0;
    }
    .content {
      padding: 30px 0;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: #1a1a1a;
    }
    p {
      margin: 15px 0;
      color: #555;
    }
    .footer {
      padding: 20px 0;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .footer-link {
      color: #0ea5e9;
      text-decoration: none;
    }
    .trust-row {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 20px 0;
      font-size: 12px;
      color: #666;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 class="logo">DSO</h2>
    </div>

    <div class="content">
      <h1>Welcome to the DSO Community!</h1>

      <p>You're now subscribed to receive updates on:</p>
      <ul style="padding-left: 20px;">
        <li>Release updates and new versions</li>
        <li>Documentation changes and guides</li>
        <li>Provider integrations and expansions</li>
        <li>Security guidance and advisories</li>
        <li>Community announcements</li>
      </ul>

      <p>DSO is the standard for secret orchestration in high-assurance Docker environments. Built for teams running production workloads, DSO enables zero-downtime secret rotation with automatic recovery.</p>

      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <strong>Getting Started</strong><br>
        <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px;">docker dso init</code><br>
        <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px;">docker dso secret set DB_PASSWORD</code><br>
        <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px;">docker dso up</code>
      </p>

      <p style="margin-top: 20px;">
        <a href="https://dso.skycloudops.in/docs" style="color: #0ea5e9; text-decoration: none;">Read the Documentation →</a>
      </p>
    </div>

    <div class="trust-row">
      <span>Open Source</span>
      <span>•</span>
      <span>Docker Native</span>
      <span>•</span>
      <span>CNCF Sandbox</span>
    </div>

    <div class="footer">
      <p>
        <a href="https://dso.skycloudops.in/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" class="footer-link">Unsubscribe</a>
      </p>
      <p style="margin: 10px 0 0 0;">
        Docker Secret Operator<br>
        CNCF Sandbox Project • Apache 2.0 Licensed
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Docker Secret Operator',
    html,
  });
}

/**
 * Generate a beautifully formatted HTML email template with DSO branding
 */
export function buildNewsletterTemplate(htmlContent: string, unsubscribeEmail: string): string {
  const unsubscribeUrl = unsubscribeEmail 
    ? `https://dso.skycloudops.in/api/newsletter/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}`
    : 'https://dso.skycloudops.in';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 24px 20px;
      background-color: #f8fafc;
      border-bottom: 1px solid #eee;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #0ea5e9;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px 32px 16px 32px;
    }
    .content h1, .content h2, .content h3 {
      color: #0f172a;
      margin-top: 0;
    }
    .content a {
      color: #0ea5e9;
      text-decoration: none;
    }
    .content a:hover {
      text-decoration: underline;
    }
    .content p {
      margin-bottom: 16px;
      color: #334155;
    }
    .content ul, .content ol {
      color: #334155;
    }
    .trust-row {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 20px 0;
      font-size: 12px;
      color: #64748b;
      background-color: #f8fafc;
      border-top: 1px solid #eee;
    }
    .footer {
      padding: 24px;
      background-color: #f8fafc;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px dashed #e2e8f0;
    }
    .footer-link {
      color: #0ea5e9;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 class="logo">DSO</h2>
    </div>

    <div class="content">
      ${htmlContent}
    </div>

    <div class="trust-row">
      <span style="display:inline-block; margin: 0 5px;">Open Source</span>
      <span style="display:inline-block; margin: 0 5px;">•</span>
      <span style="display:inline-block; margin: 0 5px;">Docker Native</span>
      <span style="display:inline-block; margin: 0 5px;">•</span>
      <span style="display:inline-block; margin: 0 5px;">CNCF Sandbox</span>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <a href="${unsubscribeUrl}" class="footer-link">Unsubscribe</a>
        <span style="margin: 0 10px;">|</span>
        <a href="https://dso.skycloudops.in" class="footer-link">Visit Website</a>
      </p>
      <p style="margin: 0;">
        Docker Secret Operator<br>
        CNCF Sandbox Project • Apache 2.0 Licensed
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send newsletter campaign
 */
export async function sendNewsletterCampaign(
  email: string,
  subject: string,
  htmlContent: string,
  unsubscribeEmail: string
): Promise<boolean> {
  const html = buildNewsletterTemplate(htmlContent, unsubscribeEmail);

  return sendEmail({
    to: email,
    subject,
    html,
  });
}
