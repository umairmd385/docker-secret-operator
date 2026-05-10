import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { SectionHeader } from "@/components/branding/BrandHeader";
import { VerificationBadge } from "@/components/branding/VerificationBadge";

const faqMetadata = {
  title: "FAQ | Docker Secret Operator",
  description:
    "Frequently asked questions about DSO, secret management, integrations, and deployment patterns.",
  keywords: [
    "dso faq",
    "docker secret operator faq",
    "secret management questions",
    "dso troubleshooting",
    "common issues",
  ],
  ogTitle: "DSO FAQ - Common Questions & Answers",
  ogDescription:
    "Get answers to frequently asked questions about Docker Secret Operator",
  ogImage: "/og-image.png",
};

export const metadata: Metadata = generatePageMetadata(faqMetadata, "/faq");

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is Docker Secret Operator?",
        a: "DSO is a runtime secret injection system for Docker containers. It eliminates the need to store secrets in environment variables or config files by injecting them from external sources (local encrypted vault, AWS Secrets Manager, Azure Key Vault, etc.) directly into container memory at startup.",
      },
      {
        q: "Do I need Kubernetes to use DSO?",
        a: "No. DSO is explicitly designed for teams NOT using Kubernetes. It's built for Docker Compose and Docker-native deployments. If you're on Kubernetes, consider External Secrets Operator (ESO) instead.",
      },
      {
        q: "Can I use DSO in development?",
        a: "Yes. DSO's Local Mode provides an encrypted vault for development without needing cloud accounts. It's perfect for learning DSO patterns before deploying to production.",
      },
      {
        q: "What providers does DSO support?",
        a: "DSO supports AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Huawei Cloud CSMS, and Local Mode (encrypted vault). See /integrations for complete setup guides.",
      },
    ],
  },
  {
    category: "Security & Operations",
    items: [
      {
        q: "How does zero-persistence work?",
        a: "Secrets are fetched at runtime and injected into container environment variables in memory. They're never written to disk, logs, or container inspect output. When the container stops, the secret is gone.",
      },
      {
        q: "Are my secrets encrypted in transit?",
        a: "Yes. All communication with cloud providers (AWS, Azure, etc.) uses TLS 1.2+. Local Mode uses AES-256-GCM encryption for secrets at rest.",
      },
      {
        q: "How does secret rotation work?",
        a: "DSO polls your secret provider at configurable intervals (default 2 minutes). When a change is detected, DSO applies your reload_strategy: restart (restart container), rolling (rolling restart), or signal (send SIGHUP).",
      },
      {
        q: "Can I use DSO with a container registry?",
        a: "Yes. DSO works with any registry. Your images don't contain secrets—they only contain references like dso://my-secret. Actual secrets come from your configured provider.",
      },
    ],
  },
  {
    category: "Deployment & Integration",
    items: [
      {
        q: "Does DSO work with Docker Compose?",
        a: "Yes. DSO works seamlessly with Docker Compose. Use dso:// references in environment variables and run 'docker dso up' instead of 'docker compose up'.",
      },
      {
        q: "Can multiple containers share the same secret?",
        a: "Yes. Multiple containers can reference the same secret. Access control is managed by your provider's IAM (AWS IAM, Azure RBAC, etc.).",
      },
      {
        q: "What happens if the secret provider is unavailable?",
        a: "By default, DSO fails fast—the container won't start if secrets can't be fetched. This prevents containers from running with missing or stale secrets.",
      },
      {
        q: "Can I use DSO with CI/CD pipelines?",
        a: "Yes. DSO works in CI/CD as long as the runner has credentials to access your secret provider. For Local Mode, use the encrypted vault in your repository.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    items: [
      {
        q: "Secret not found error",
        a: "Verify the secret name in dso.yaml matches exactly what's in your provider. Check that your credentials have permission to read that secret. Run 'docker dso doctor' for diagnostics.",
      },
      {
        q: "Permission denied",
        a: "Your credentials don't have permission to access that secret. For AWS: check IAM policy. For Azure: check RBAC role. For Vault: check AppRole permissions.",
      },
      {
        q: "Container starts but secret is empty",
        a: "Check that dso.yaml uses dso://SECRET_NAME syntax (not hardcoded values). Verify the secret exists in your provider. Check logs: 'docker dso logs container-name'",
      },
      {
        q: "How do I debug secret injection?",
        a: "Use 'docker dso doctor' to verify setup. Check 'docker dso logs' for detailed output. For container inspection: 'docker exec container env | grep SECRET' shows injected values.",
      },
    ],
  },
  {
    category: "Billing & Licensing",
    items: [
      {
        q: "Is DSO free?",
        a: "Yes. DSO is open source under Apache 2.0. You only pay for the secrets infrastructure (AWS charges ~$0.40/secret/month, etc.).",
      },
      {
        q: "Can I use DSO commercially?",
        a: "Yes. Apache 2.0 allows commercial use. Check the LICENSE file for full details.",
      },
      {
        q: "What's the difference between DSO and paid alternatives?",
        a: "DSO is open source and designed for developers. Paid alternatives add GUI, audit dashboards, and enterprise support. Choose DSO if you prefer CLI-driven simplicity.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <SectionHeader
          title="Frequently Asked Questions"
          description="Find answers to common questions about DSO, secret management, and deployment"
          showLogo={false}
        />

        {/* Verification Status */}
        <div className="mb-12">
          <VerificationBadge
            status="verified"
            variant="card"
            lastVerified="2026-05-10"
            showDate={true}
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-16">
          {faqs.map((section) => (
            <section key={section.category}>
              <h2 className="text-2xl font-bold mb-8 text-foreground">
                {section.category}
              </h2>

              <div className="space-y-6">
                {section.items.map((item, idx) => (
                  <details
                    key={idx}
                    className="group rounded-lg border border-white/10 p-6 hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <summary className="flex items-start justify-between gap-4 font-semibold text-lg text-foreground cursor-pointer select-none">
                      <span>{item.q}</span>
                      <span className="text-accent group-open:rotate-180 transition-transform flex-shrink-0">
                        ▼
                      </span>
                    </summary>

                    <p className="mt-4 text-gray-400 leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions? */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="rounded-xl bg-white/5 border border-accent/20 p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Check out the full documentation, join our community, or open an
              issue on GitHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/docs"
                className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-background font-bold rounded-lg transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/docker-secret-operator/dso/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-bold rounded-lg transition-colors"
              >
                GitHub Issues
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
