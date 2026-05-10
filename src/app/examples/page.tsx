import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { SectionHeader } from "@/components/branding/BrandHeader";
import { ProviderGrid, ProviderCard } from "@/components/branding/ProviderCard";

const examplesMetadata = {
  title: "Examples | Docker Secret Operator",
  description:
    "Complete, verified examples for integrating DSO with AWS, Azure, Vault, Huawei Cloud, and Local Mode.",
  keywords: [
    "dso examples",
    "docker secret operator examples",
    "aws secrets manager example",
    "azure key vault example",
    "vault integration example",
    "dso docker compose",
  ],
  ogTitle: "DSO Examples - Production-Ready Configurations",
  ogDescription:
    "Working examples for every DSO integration with complete code and explanations",
  ogImage: "/og-image.png",
};

export const metadata: Metadata = generatePageMetadata(
  examplesMetadata,
  "/examples"
);

const examples = [
  {
    name: "Local Mode",
    slug: "local-mode",
    description:
      "Development example using DSO's encrypted vault. No cloud setup needed.",
    category: "Development",
    lastVerified: "2026-05-10",
    features: [
      "AES-256-GCM encryption",
      "Zero external dependencies",
      "Perfect for learning DSO patterns",
    ],
    link: "/examples/local-mode",
    verified: true,
  },
  {
    name: "AWS Secrets Manager",
    slug: "aws-secrets-manager",
    description:
      "Production example using AWS Secrets Manager for secret storage and rotation.",
    category: "Cloud",
    lastVerified: "2026-05-10",
    features: [
      "IAM authentication",
      "Automatic rotation",
      "Audit logging via CloudTrail",
    ],
    link: "/examples/aws-secrets-manager",
    verified: true,
  },
  {
    name: "Azure Key Vault",
    slug: "azure-key-vault",
    description:
      "Enterprise example using Azure Key Vault with managed identity authentication.",
    category: "Cloud",
    lastVerified: "2026-05-10",
    features: [
      "Managed Identity support",
      "RBAC integration",
      "Compliance-ready",
    ],
    link: "/examples/azure-key-vault",
    verified: true,
  },
  {
    name: "HashiCorp Vault",
    slug: "hashicorp-vault",
    description:
      "Self-hosted example using HashiCorp Vault with AppRole authentication.",
    category: "Self-Hosted",
    lastVerified: "2026-05-10",
    features: [
      "AppRole auth",
      "Dynamic secrets support",
      "Self-managed infrastructure",
    ],
    link: "/examples/hashicorp-vault",
    verified: true,
  },
  {
    name: "Huawei Cloud CSMS",
    slug: "huawei-cloud",
    description:
      "Example for Huawei Cloud using Cloud Secret Management Service with ECS Agency.",
    category: "Cloud",
    lastVerified: "2026-05-10",
    features: [
      "ECS Agency authentication",
      "Regional endpoints",
      "CloudTrace auditing",
    ],
    link: "/examples/huawei-cloud",
    verified: true,
  },
  {
    name: "Multi-Provider Setup",
    slug: "multi-provider",
    description:
      "Advanced example showing how to use different providers for different environments.",
    category: "Advanced",
    lastVerified: "2026-05-10",
    features: [
      "Dev, staging, prod configuration",
      "Provider switching",
      "Environment parity",
    ],
    link: "/examples/multi-provider",
    verified: true,
  },
];

const categories = ["Development", "Cloud", "Self-Hosted", "Advanced"];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-background py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <SectionHeader
          title="Examples"
          description="Complete, production-ready examples for every DSO integration. All verified against official provider documentation."
          showLogo={false}
        />

        {/* Examples by Category */}
        {categories.map((category) => {
          const categoryExamples = examples.filter(
            (ex) => ex.category === category
          );
          if (categoryExamples.length === 0) return null;

          return (
            <section key={category} className="mb-16 sm:mb-24">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
                {category}
              </h2>

              <ProviderGrid providers={categoryExamples} columns={2} />
            </section>
          );
        })}

        {/* What's Included */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            What's Included in Each Example
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "dso.yaml Configuration",
                description:
                  "Complete configuration file with all required settings and common options documented",
              },
              {
                title: "docker-compose.yaml Stack",
                description:
                  "Full application stack showing secret injection in action with realistic services",
              },
              {
                title: "Setup Instructions",
                description:
                  "Step-by-step guide for configuring credentials and deploying the example",
              },
              {
                title: "Expected Output",
                description:
                  "What you should see when the example runs successfully",
              },
              {
                title: "Troubleshooting",
                description:
                  "Common issues and solutions specific to this integration",
              },
              {
                title: "Security Notes",
                description:
                  "Best practices and important security considerations for production use",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/10 p-6 hover:border-accent/50 transition-colors"
              >
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="rounded-xl bg-white/5 border border-accent/20 p-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Getting Started
            </h3>
            <p className="text-gray-400 mb-6">
              Pick an example that matches your infrastructure, follow the setup
              instructions, and deploy your first DSO application. All examples
              are tested and verified to work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/integrations"
                className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-background font-bold rounded-lg transition-colors text-center"
              >
                View Integration Guides
              </a>
              <a
                href="/docs"
                className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-bold rounded-lg transition-colors text-center"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
