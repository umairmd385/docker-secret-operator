import React from "react";
import { ProviderCard } from "@/components/branding/ProviderCard";

export function Providers() {
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
    <section className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-background to-blue-500/3 border-t border-b border-blue-500/15 overflow-hidden">
      {/* Blue telemetry glow for integrations context */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/6 to-transparent rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            Works With Your Providers
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Works seamlessly with your existing infrastructure. All integrations are verified, production-tested, and maintained.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.slug} {...provider} />
          ))}
        </div>

        <div className="mt-12 sm:mt-16 p-8 sm:p-12 rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/8 via-accent/5 to-transparent shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Need a different provider?</h3>
              <p className="text-gray-400">Check out our complete integration guide for all supported providers.</p>
            </div>
            <a
              href="/integrations"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent to-emerald-500 hover:from-accent hover:to-emerald-500 text-background font-semibold rounded-lg transition-all whitespace-nowrap shadow-lg shadow-accent/20 hover:shadow-accent/30"
            >
              View All →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
