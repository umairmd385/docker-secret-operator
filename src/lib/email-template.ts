/**
 * Compact newsletter email templates
 */

export const getWelcomeEmailHTML = (email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to DSO</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: linear-gradient(135deg, #003d1a 0%, #00453f 100%); color: white; padding: 30px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .content { padding: 30px 20px; }
        .greeting { color: #00ffd1; font-size: 18px; font-weight: 600; margin-bottom: 15px; }
        .text { color: #555; font-size: 14px; margin-bottom: 15px; }
        .command { background: #f5f5f5; border-left: 3px solid #00ffd1; padding: 12px; font-family: monospace; font-size: 13px; margin: 15px 0; }
        .links { margin: 20px 0; }
        .links a { color: #00ffd1; text-decoration: none; margin: 0 10px; }
        .footer { background: #f9f9f9; padding: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        .footer a { color: #00ffd1; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🐳 DSO</div>
            <div style="font-size: 14px; opacity: 0.9;">Docker Secret Operator</div>
        </div>

        <div class="content">
            <div class="greeting">Welcome to the Community! 🎉</div>

            <p class="text">
                Thanks for subscribing! DSO is a zero-persistence secret management system for Docker with support for AWS, Azure, HashiCorp Vault, and local encrypted vaults.
            </p>

            <p class="text"><strong>Quick start:</strong></p>
            <div class="command">$ docker dso up -d</div>

            <p class="text">That's it! DSO starts in Local Mode with native AES-256 encryption.</p>

            <div class="links">
                📖 <a href="https://dso.skycloudops.in/docs/">Documentation</a> •
                ⭐ <a href="https://github.com/docker-secret-operator/dso">GitHub</a> •
                💬 <a href="https://discord.gg/skycloudops">Discord</a>
            </div>
        </div>

        <div class="footer">
            <p>The DSO Team • Powered by SkyCloudOps</p>
            <p><a href="https://dso.skycloudops.in/docs/guide/privacy.html">Privacy</a> • <a href="#">Unsubscribe</a></p>
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: linear-gradient(135deg, #003d1a 0%, #00453f 100%); color: white; padding: 30px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .content { padding: 30px 20px; text-align: center; }
        .icon { font-size: 40px; margin: 15px 0; }
        .title { color: #00ffd1; font-size: 20px; font-weight: 600; margin: 15px 0; }
        .text { color: #555; font-size: 14px; margin: 10px 0; }
        .footer { background: #f9f9f9; padding: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        .footer a { color: #00ffd1; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🐳 DSO</div>
        </div>

        <div class="content">
            <div class="icon">✓</div>
            <div class="title">Already Subscribed!</div>

            <p class="text">You're already on our newsletter list.</p>
            <p class="text">You'll receive updates about DSO features, security advisories, and architecture deep-dives.</p>

            <p class="text" style="margin-top: 20px;">
                📖 <a href="https://dso.skycloudops.in/docs/" style="color: #00ffd1; text-decoration: none;">View Documentation</a> •
                💬 <a href="https://discord.gg/skycloudops" style="color: #00ffd1; text-decoration: none;">Join Discord</a>
            </p>
        </div>

        <div class="footer">
            <p>The DSO Team • Powered by SkyCloudOps</p>
        </div>
    </div>
</body>
</html>
`;
