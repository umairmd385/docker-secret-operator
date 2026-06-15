import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DeploymentPaths } from "@/components/sections/DeploymentPaths";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Deploy | Docker Secret Operator",
    description:
      "Get started with DSO. Installation guides for Docker Compose, AWS, Azure, Vault, Huawei Cloud, and local mode. Setup examples and migration paths.",
  },
  "/deploy"
);

export default function DeployPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        <Navbar />

        {/* Installation Paths */}
        <DeploymentPaths />

        {/* Setup Examples Section */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Setup Examples
              </h2>
              <p className="text-lg text-gray-400">
                Complete, verified examples for every deployment platform. Copy-paste ready with explanations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Docker Compose (Local)",
                  description:
                    "Development setup with encrypted local vault. Perfect for learning DSO.",
                  features: [
                    "AES-256-GCM encryption",
                    "Zero external dependencies",
                    "Learn DSO patterns",
                  ],
                  link: "/docs/guide/docker-compose",
                },
                {
                  name: "AWS Secrets Manager",
                  description:
                    "Production example using AWS Secrets Manager for secret storage.",
                  features: [
                    "IAM authentication",
                    "Automatic rotation",
                    "CloudTrail auditing",
                  ],
                  link: "/docs/guide/providers#aws",
                },
                {
                  name: "Azure Key Vault",
                  description:
                    "Enterprise example using Azure Key Vault with managed identity.",
                  features: [
                    "Managed Identity support",
                    "RBAC integration",
                    "Compliance-ready",
                  ],
                  link: "/docs/guide/providers#azure",
                },
                {
                  name: "HashiCorp Vault",
                  description:
                    "Self-hosted example using HashiCorp Vault with AppRole auth.",
                  features: [
                    "AppRole authentication",
                    "Dynamic secrets",
                    "Self-managed infrastructure",
                  ],
                  link: "/docs/guide/providers#vault",
                },
                {
                  name: "Huawei Cloud KMS",
                  description:
                    "Example for Huawei Cloud using Cloud Secret Management Service.",
                  features: [
                    "ECS Agency authentication",
                    "Regional endpoints",
                    "CloudTrace auditing",
                  ],
                  link: "/docs/guide/providers#huawei",
                },
                {
                  name: "Multi-Provider Setup",
                  description:
                    "Advanced example showing how to use different providers per environment.",
                  features: [
                    "Dev, staging, prod setup",
                    "Provider switching",
                    "Environment parity",
                  ],
                  link: "/docs/guide/configuration",
                },
              ].map((example, idx) => (
                <a
                  key={idx}
                  href={example.link}
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/50 hover:bg-gray-900/50 transition-all duration-300 group"
                >
                  <h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-accent transition-colors">
                    {example.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {example.description}
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    {example.features.map((feature, fIdx) => (
                      <li key={fIdx}>✓ {feature}</li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>

            <div className="p-6 rounded-lg border border-accent/20 bg-accent/5 text-center">
              <p className="text-gray-400 mb-4">
                For detailed setup instructions, see the full documentation.
              </p>
              <a
                href="/docs"
                className="inline-block px-6 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                View Full Documentation →
              </a>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                What's Included in Each Example
              </h2>
            </div>

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
                  className="rounded-lg border border-gray-800 p-6 hover:border-accent/30 hover:bg-gray-900/30 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
