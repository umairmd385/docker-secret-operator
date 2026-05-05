import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from 'redis';
import { getWelcomeEmailHTML, getAlreadySubscribedEmailHTML } from '@/lib/email-template';

let redisClient: any = null;

// Initialize Redis connection
async function getRedisClient() {
  if (!redisClient) {
    try {
      redisClient = await createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      }).connect();
    } catch (error) {
      console.error('Redis connection error:', error);
      return null;
    }
  }
  return redisClient;
}

async function isSubscribed(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.toLowerCase();
    const client = await getRedisClient();

    if (!client) {
      console.warn('Redis not available');
      return false;
    }

    const exists = await client.exists(`subscriber:${normalizedEmail}`);
    return exists === 1;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

async function addSubscriber(email: string): Promise<void> {
  try {
    const normalizedEmail = email.toLowerCase();
    const client = await getRedisClient();

    if (!client) {
      console.warn('Redis not available, skipping subscriber storage');
      return;
    }

    await client.set(
      `subscriber:${normalizedEmail}`,
      JSON.stringify({
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
      }),
      { EX: 31536000 } // 1 year expiry
    );
  } catch (error) {
    console.error('Error saving subscriber:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      console.error('Gmail credentials not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Check if already subscribed (case-insensitive)
    const isAlreadySubscribed = await isSubscribed(email);

    // Configure the transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Determine email template and message based on subscription status
    let subject: string;
    let html: string;
    let message: string;

    if (isAlreadySubscribed) {
      subject = 'Already Subscribed to DSO Newsletter';
      html = getAlreadySubscribedEmailHTML();
      message = 'You are already subscribed to the DSO newsletter. Check your email for updates!';
    } else {
      subject = 'Welcome to the DSO Community — Secure Your Docker Secrets';
      html = getWelcomeEmailHTML(email);
      message = 'Welcome! Check your email for the welcome message.';
      // Add to subscribers list
      await addSubscriber(email);
    }

    const mailOptions = {
      from: `"DSO Team" <${gmailUser}>`,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
