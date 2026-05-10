import React from "react";
import { ProviderCard } from "@/components/branding/ProviderCard";

export function FeaturedIntegrations() {
  const featuredProviders = [
    {
      name: "AWS Secrets Manager",
      slug: "aws-secrets-manager",
      description: "Enterprise-grade secret management with IAM authentication and CloudTrail auditing.",
      category: "Cloud",
      lastVerified: "2026-05-10",
      features: [
        "IAM-based authentication",
        "Automatic secret rotation",
        "CloudTrail audit logging",
      ],
      link: "/integrations/aws-secrets-manager",
      verified: true,
    },
    {
      name: "Local Mode",
      slug: "local-mode",
      description: "Development-friendly encrypted vault. No cloud setup needed.",
      category: "Development",
      lastVerified: "2026-05-10",
      features: [
        "AES-256-GCM encryption",
        "Zero cloud dependencies",
        "Perfect for learning DSO",
      ],
      link: "/integrations/local-mode",
      verified: true,
    },
    {
      name: "Azure Key Vault",
      slug: "azure-key-vault",
      description: "Enterprise integration with Managed Identity and RBAC support.",
      category: "Cloud",
      lastVerified: "2026-05-10",
      features: [
        "Managed Identity support",
        "RBAC integration",
        "Compliance-ready",
      ],
      link: "/integrations/azure-key-vault",
      verified: true,
    },
    {
      name: "HashiCorp Vault",
      slug: "hashicorp-vault",
      description: "Self-hosted secret management with AppRole authentication.",
      category: "Self-Hosted",
      lastVerified: "2026-05-10",
      features: [
        "AppRole authentication",
        "Dynamic secrets support",
        "Self-managed infrastructure",
      ],
      link: "/integrations/hashicorp-vault",
      verified: true,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Popular Integrations
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            DSO works with your favorite cloud providers and self-hosted solutions.
            All integrations are verified and production-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.slug} {...provider} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/integrations"
            className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-background font-bold rounded-lg transition-colors"
          >
            View All Integrations
          </a>
        </div>
      </div>
    </section>
  );
}
