import { Metadata } from "next";
import { getAllIntegrations } from "@/content/integrations";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";

export const metadata: Metadata = generatePageMetadata(
  {
    title: "Integrations | DSO",
    description: "Docker Secret Operator integration guides for AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Kubernetes, and Docker Compose. Setup instructions and best practices.",
    keywords: [
      "dso integrations",
      "docker secret operator integrations",
      "aws secrets manager",
      "azure key vault",
      "vault integration",
      "kubernetes secrets",
      "docker compose",
    ],
    ogTitle: "DSO Integration Guides",
    ogDescription: "Setup guides for integrating Docker Secret Operator with cloud providers and orchestration platforms",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },
  "/integrations"
);

export default function IntegrationsPage() {
  const integrations = getAllIntegrations();

  // Group integrations by category
  const categories: Record<string, typeof integrations> = {
    "Cloud Providers": [],
    "Self-Hosted": [],
    "Container Orchestration": [],
    "Local Development": [],
  };

  integrations.forEach((integration) => {
    switch (integration.slug) {
      case "aws-secrets-manager":
      case "azure-key-vault":
      case "huawei-cloud":
        categories["Cloud Providers"].push(integration);
        break;
      case "hashicorp-vault":
        categories["Self-Hosted"].push(integration);
        break;
      case "kubernetes":
        categories["Container Orchestration"].push(integration);
        break;
      case "docker-compose":
      case "local-mode":
        categories["Local Development"].push(integration);
        break;
    }
  });

  return (
    <main className="min-h-screen bg-background py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Integration Guides
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comprehensive setup guides for integrating Docker Secret Operator with your infrastructure. Choose your platform and follow step-by-step instructions.
          </p>
        </header>

        {/* Integrations by Category */}
        {Object.entries(categories).map(([category, items]) => (
          items.length > 0 && (
            <section key={category} className="mb-16 sm:mb-24">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
                {category}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {items.map((integration) => (
                  <a
                    key={integration.slug}
                    href={`/integrations/${integration.slug}`}
                    className="group relative p-6 sm:p-8 border border-white/10 rounded-xl hover:border-accent/50 transition-all duration-300"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                      {/* Provider Info */}
                      <div className="flex items-start gap-4 mb-4">
                        {integration.provider.logo && (
                          <img
                            src={integration.provider.logo}
                            alt={integration.provider.name}
                            className="w-12 h-12 rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {integration.provider.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {integration.slug.replace(/-/g, " ")}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {integration.description}
                      </p>

                      {/* Key Features */}
                      <div className="space-y-2 mb-6">
                        <div className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                          Setup Includes:
                        </div>
                        <div className="space-y-1">
                          {integration.setupGuide.prerequisites.slice(0, 3).map((prereq: string, idx: number) => (
                            <div key={idx} className="text-sm text-gray-400">
                              <span className="text-accent">•</span> {prereq.substring(0, 50)}...
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-accent group-hover:gap-3 transition-all">
                        View Setup Guide
                        <span>→</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        ))}

        {/* Bottom CTA */}
        <section className="mt-20 pt-16 border-t border-white/10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Getting Started?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Each integration guide includes prerequisites, step-by-step setup, code examples, troubleshooting, and FAQs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs"
              className="inline-block px-8 py-3 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              View Documentation
            </a>
            <a
              href="/comparisons"
              className="inline-block px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors"
            >
              Compare Solutions
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
