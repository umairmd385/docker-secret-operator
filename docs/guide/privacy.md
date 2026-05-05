# Privacy Policy

**Last Updated**: May 2026

## Overview

Docker Secret Operator (DSO) is an open-source project committed to user privacy. This privacy policy explains how data is handled when you use DSO and interact with the DSO website and documentation.

## Data Collection

### What We Collect

- **Usage Analytics**: Non-identifying usage statistics collected via Vercel Analytics (page views, referrers, device type)
- **Newsletter Signups**: Email addresses provided voluntarily through the newsletter signup form
- **Error Logs**: Server-side error logs (no personal data included)

### What We Don't Collect

- **No User Tracking**: DSO does not include telemetry or tracking in the operator binary itself
- **No Behavioral Profiling**: We do not profile user behavior beyond basic analytics
- **No Third-Party Cookies**: We do not use third-party tracking or advertising cookies
- **No Device Fingerprinting**: We do not fingerprint or track devices

## Data Usage

### Newsletter Emails

Emails collected through the newsletter signup form are used solely to:
- Send welcome messages
- Provide updates on DSO releases and security advisories
- Share architectural deep-dives and best practices

You can unsubscribe at any time by replying with "unsubscribe" or clicking an unsubscribe link in emails.

### Analytics Data

Analytics data helps us understand:
- Popular documentation pages
- Traffic sources
- Device and browser compatibility
- Geographic distribution (country-level only)

This data is aggregated and anonymized.

## Data Storage & Security

- **Email Storage**: Emails are stored securely with Gmail's infrastructure
- **Analytics**: Data is stored on Vercel's infrastructure with industry-standard encryption
- **Retention**: Email lists are retained indefinitely unless you request deletion; analytics data follows Vercel's default retention policy
- **Encryption in Transit**: All data transmission uses HTTPS/TLS encryption

## The DSO Operator Binary

The DSO operator (the actual Docker plugin) does not collect any data:
- No telemetry is sent to any server
- No usage statistics are reported
- No environment data is logged remotely
- All operations are local to your Docker host

## Third-Party Services

We use the following services:

| Service | Purpose | Data Shared | Privacy Link |
|---------|---------|-------------|--------------|
| Vercel | Hosting & Analytics | Page views, referrers, device type | [vercel.com/privacy](https://vercel.com/privacy) |
| Gmail | Newsletter delivery | Email addresses | [google.com/policies/privacy](https://google.com/policies/privacy) |
| GitHub | Code hosting | Public repository data | [github.com/privacy](https://github.com/privacy) |

## Your Rights

Depending on your location, you may have rights to:
- **Access**: Request a copy of your data
- **Deletion**: Request deletion of your email from our newsletter
- **Correction**: Request correction of inaccurate data
- **Portability**: Request your data in a portable format

To exercise these rights, email `umairmd385@gmail.com` with "Privacy Request" in the subject line.

## GDPR & Privacy Laws

For users in the EU (GDPR), UK (UKPDC), or other jurisdictions with privacy regulations:
- We collect personal data only with your consent (newsletter signup)
- We process data only for stated purposes
- We retain data only as long as necessary
- We respect your right to withdraw consent
- We maintain a Data Processing Agreement with Vercel

If you have concerns about our privacy practices, you may lodge a complaint with your local data protection authority.

## Changes to This Policy

We may update this privacy policy periodically. Changes will be posted here with an updated "Last Updated" date. Continued use of DSO after changes constitutes acceptance of the updated policy.

## Contact

For privacy inquiries or concerns:
- **Email**: `umairmd385@gmail.com`
- **Subject**: "Privacy Inquiry"
- **GitHub**: [docker-secret-operator/dso](https://github.com/docker-secret-operator/dso)

## Open Source Transparency

DSO is fully open-source under the Apache-2.0 license. You can review exactly what data is collected and how by inspecting:
- Frontend source code: [github.com/docker-secret-operator/dso](https://github.com/docker-secret-operator/dso)
- This documentation is part of the public repository

---

**Remember**: DSO is a security-first tool. Your secrets never leave your Docker host. Your privacy is fundamental to that commitment.
