/**
 * Professional newsletter email template
 * Mobile-responsive HTML email
 */

export const getWelcomeEmailHTML = (email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Docker Secret Operator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f9fafb;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #003d1a 0%, #00453f 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header-logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        .header-tagline {
            font-size: 14px;
            opacity: 0.95;
            font-weight: 400;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #00ffd1;
            margin-bottom: 20px;
        }
        .intro-text {
            font-size: 15px;
            color: #4a5568;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        .feature-box {
            background: #f7fafc;
            border-left: 4px solid #00ffd1;
            padding: 24px;
            margin: 28px 0;
            border-radius: 6px;
        }
        .feature-box-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 16px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
        }
        .feature-list li {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 12px;
            padding-left: 28px;
            position: relative;
        }
        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #00ffd1;
            font-weight: 700;
            font-size: 18px;
        }
        .cta-button {
            display: inline-block;
            background: #00ffd1;
            color: #003d1a;
            padding: 14px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            margin: 24px 0;
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            background: #00e6c0;
            transform: translateY(-2px);
        }
        .resources-section {
            background: #f0fdf4;
            border: 1px solid #dcfce7;
            padding: 24px;
            border-radius: 6px;
            margin: 28px 0;
        }
        .resources-title {
            font-size: 16px;
            font-weight: 600;
            color: #166534;
            margin-bottom: 16px;
        }
        .resources-list {
            list-style: none;
            padding: 0;
        }
        .resources-list li {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .resources-list a {
            color: #15803d;
            text-decoration: none;
            font-weight: 500;
        }
        .resources-list a:hover {
            text-decoration: underline;
        }
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 28px 0;
        }
        .footer-section {
            background: #f7fafc;
            padding: 24px 30px;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        .command-box {
            background: #1a202c;
            color: #00ffd1;
            padding: 16px;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            margin: 16px 0;
            overflow-x: auto;
            border-left: 3px solid #00ffd1;
        }
        .unsubscribe {
            font-size: 12px;
            text-align: center;
            color: #94a3b8;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .unsubscribe a {
            color: #64748b;
            text-decoration: none;
        }
        .social-links {
            text-align: center;
            margin: 24px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #00ffd1;
            font-size: 13px;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .content {
                padding: 24px 16px;
            }
            .header {
                padding: 28px 16px;
            }
            .feature-box {
                padding: 16px;
            }
            .greeting {
                font-size: 16px;
            }
            .intro-text {
                font-size: 14px;
            }
            .command-box {
                font-size: 12px;
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-logo">🐳 DSO</div>
            <div class="header-tagline">Docker Secret Operator</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Welcome to the Community! 🎉</div>

            <p class="intro-text">
                Hi there,<br><br>
                Thanks for joining the <strong>Docker Secret Operator (DSO)</strong> community!
            </p>

            <p class="intro-text">
                DSO was built to bridge the gap between simple Docker Compose setups and enterprise-grade secret management. Whether you're working in <strong>Local Mode</strong> with our native AES-256 vault or scaling to <strong>Cloud Mode</strong> with AWS, Azure, or Huawei, we're excited to have you on board.
            </p>

            <!-- Feature Highlight -->
            <div class="feature-box">
                <div class="feature-box-title">Why DSO?</div>
                <ul class="feature-list">
                    <li>Zero Disk Persistence — Secrets never touch disk</li>
                    <li>Event-Driven — Auto-rotation & reconciliation</li>
                    <li>Multi-Provider — AWS, Azure, HashiCorp Vault, Local</li>
                    <li>Production Ready — Enterprise-grade security</li>
                </ul>
            </div>

            <!-- Quick Start -->
            <div class="resources-section">
                <div class="resources-title">📚 Quick Start Resources</div>
                <ul class="resources-list">
                    <li>📖 <a href="https://dso.run/docs">Complete Documentation</a> — Full guides & API reference</li>
                    <li>⭐ <a href="https://github.com/docker-secret-operator/dso">GitHub Repository</a> — Source code & issues</li>
                    <li>🔐 <a href="https://dso.run/docs/guide/production-readiness">Security & Best Practices</a> — Production readiness guide</li>
                </ul>
            </div>

            <!-- First Command -->
            <p class="intro-text" style="margin-top: 24px; margin-bottom: 12px;">
                <strong>Get started in seconds:</strong>
            </p>
            <div class="command-box">$ docker dso up -d</div>

            <p class="intro-text">
                That's it! DSO will start in Local Mode with a native AES-256 vault.
            </p>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- What's Next -->
            <div class="intro-text">
                <strong>What's Next?</strong><br>
                <ul style="margin-left: 20px; margin-top: 12px; list-style-type: disc; color: #4a5568;">
                    <li style="margin-bottom: 8px;">Check out the <a href="https://dso.run/docs" style="color: #00ffd1; text-decoration: none;">Getting Started guide</a></li>
                    <li style="margin-bottom: 8px;">Explore <a href="https://dso.run/docs" style="color: #00ffd1; text-decoration: none;">cloud provider integrations</a></li>
                    <li style="margin-bottom: 8px;">Join our community on <a href="https://discord.gg/skycloudops" style="color: #00ffd1; text-decoration: none;">Discord</a></li>
                </ul>
            </div>

            <!-- Social -->
            <div class="social-links">
                <a href="https://github.com/docker-secret-operator/dso">GitHub</a>
                <a href="https://x.com/skycloudops">Twitter</a>
                <a href="https://discord.gg/skycloudops">Discord</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer-section">
            <p class="footer-text">
                <strong>Stay Secure,</strong><br>
                The DSO Team<br>
                <em style="color: #94a3b8;">Powered by SkyCloudOps</em>
            </p>

            <p class="footer-text">
                We'll send you occasional updates on DSO v3.2 features, security advisories, and architecture deep-dives. If you have any questions, feel free to reply to this email!
            </p>

            <!-- Unsubscribe -->
            <div class="unsubscribe">
                <p>You're receiving this because you subscribed to the DSO newsletter.</p>
                <p><a href="https://github.com/docker-secret-operator/dso/blob/main/docs/guide/privacy.md">Privacy Policy</a> • <a href="%UNSUBSCRIBE_URL%">Unsubscribe</a></p>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const getAlreadySubscribedEmailHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Already Subscribed</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f9fafb;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #003d1a 0%, #00453f 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #00ffd1;
            margin-bottom: 16px;
        }
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        .info-box {
            background: #f0fdf4;
            border: 1px solid #dcfce7;
            border-left: 4px solid #00ffd1;
            padding: 20px;
            border-radius: 6px;
            margin: 24px 0;
            text-align: left;
        }
        .info-box-title {
            font-weight: 600;
            color: #166534;
            margin-bottom: 12px;
        }
        .info-box-text {
            font-size: 14px;
            color: #4a5568;
        }
        .link {
            color: #00ffd1;
            text-decoration: none;
            font-weight: 500;
        }
        .link:hover {
            text-decoration: underline;
        }
        .footer {
            background: #f7fafc;
            padding: 24px 30px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 13px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div style="font-size: 32px; font-weight: 700;">🐳 DSO</div>
        </div>

        <div class="content">
            <div class="icon">✓</div>
            <div class="title">Already Subscribed!</div>

            <p class="message">
                Great news! You're already subscribed to the DSO newsletter.<br>
                You'll receive updates about DSO v3.2 features, security advisories, and architecture deep-dives.
            </p>

            <div class="info-box">
                <div class="info-box-title">What's in your inbox?</div>
                <div class="info-box-text">
                    <p style="margin-bottom: 8px;">✓ DSO v3.2 feature announcements</p>
                    <p style="margin-bottom: 8px;">✓ Security advisories & patches</p>
                    <p style="margin-bottom: 8px;">✓ Architecture deep-dives</p>
                    <p>✓ Community highlights & use cases</p>
                </div>
            </div>

            <p class="message">
                In the meantime, explore the <a href="https://dso.run/docs" class="link">documentation</a> or join our <a href="https://discord.gg/skycloudops" class="link">Discord community</a>.
            </p>
        </div>

        <div class="footer">
            <p>Questions? Check our <a href="https://github.com/docker-secret-operator/dso/blob/main/docs/guide/privacy.md" class="link">privacy policy</a> or visit the <a href="https://github.com/docker-secret-operator/dso" class="link">GitHub repository</a>.</p>
            <p style="margin-top: 12px; color: #94a3b8;">The DSO Team • Powered by SkyCloudOps</p>
        </div>
    </div>
</body>
</html>
`;
