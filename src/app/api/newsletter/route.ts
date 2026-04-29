import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Configure the transporter with Gmail
    // IMPORTANT: You must use an "App Password" from Gmail, not your regular password.
    // Go to: Google Account > Security > 2-Step Verification > App Passwords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'umairmd385@gmail.com',
        pass: 'qxuf xkbr vaoq orhm', 
      },
    });

    const mailOptions = {
      from: '"DSO Team" <umairmd385@gmail.com>',
      to: email,
      subject: 'Welcome to the DSO Community — Secure Your Docker Secrets',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00e6c0;">Welcome to the DSO Community!</h2>
          <p>Hi there,</p>
          <p>Thanks for joining the Docker Secret Operator (DSO) community!</p>
          <p>DSO was built to bridge the gap between simple Docker Compose setups and enterprise-grade secret management. Whether you're working in <b>Local Mode</b> with our native AES-256 vault or scaling to <b>Cloud Mode</b> with AWS, Azure, or Huawei, we're excited to have you onboard.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 16px;">Quick Start Resources:</h3>
            <ul style="padding-left: 20px;">
              <li>📖 <a href="https://dso.skycloudops.in/docs" style="color: #00e6c0;">Documentation</a></li>
              <li>⭐ <a href="https://github.com/docker-secret-operator/dso" style="color: #00e6c0;">GitHub Repository</a></li>
              <li>🚀 <b>First Command:</b> <code>docker dso up -d</code></li>
            </ul>
          </div>
          
          <p>We'll send you occasional updates on DSO v3.2 features, security advisories, and architecture deep-dives. If you have any questions, feel free to reply to this email!</p>
          
          <p>Stay secure,<br><b>The DSO Team</b><br><small>Powered by SkyCloudOps</small></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
