import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getWelcomeEmailHTML, getAlreadySubscribedEmailHTML } from '@/lib/email-template';
import * as fs from 'fs';
import * as path from 'path';

// Subscriber tracking using JSON file
const SUBSCRIBERS_FILE = path.join(process.cwd(), '.next', 'cache', 'subscribers.json');

async function getSubscribers(): Promise<string[]> {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading subscribers:', error);
  }
  return [];
}

async function addSubscriber(email: string): Promise<void> {
  try {
    const subscribers = await getSubscribers();
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      const dir = path.dirname(SUBSCRIBERS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    }
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

    // Check if already subscribed
    const subscribers = await getSubscribers();
    const isAlreadySubscribed = subscribers.includes(email);

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
