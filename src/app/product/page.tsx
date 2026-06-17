import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhyDSO } from "@/components/sections/WhyDSO";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Product | Docker Secret Operator",
    description:
      "Explore DSO's operational guarantees, capabilities, and how it compares to manual scripts, Infisical, and HashiCorp Vault.",
  },
  "/product"
);

export default function ProductPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        <Navbar />

        {/* Use Cases - Moved to top (concrete examples first) */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                What You Can Do With DSO
              </h2>
              <p className="text-lg text-secondary">
                Zero-downtime secret rotation for containerized workloads.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Database Credentials",
                  description:
                    "Rotate database passwords without dropping connections. Services reconnect automatically with refreshed credentials.",
                  example: "PostgreSQL, MySQL, MongoDB",
                },
                {
                  title: "API Keys",
                  description:
                    "Keep API keys fresh by rotating automatically. Dependent services pick up new keys on next request.",
                  example: "Third-party APIs, internal services",
                },
                {
                  title: "TLS Certificates",
                  description:
                    "Update SSL certificates before expiration. Traffic never interrupts during certificate rotation.",
                  example: "Mutual TLS, self-signed certificates",
                },
              ].map((useCase, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-secondary mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  <p className="text-xs text-tertiary italic">
                    Example: {useCase.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get - Operational Capabilities */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                What You Get With DSO
              </h2>
              <p className="text-lg text-secondary">
                Operational capabilities you can count on.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                {
                  icon: "✓",
                  title: "Zero-Downtime Rotation",
                  description: "Secrets rotate without interrupting healthy services or dropping connections.",
                },
                {
                  icon: "✓",
                  title: "Automatic Recovery",
                  description: "Recover safely after interruptions, crashes, or failed health checks without manual intervention.",
                },
                {
                  icon: "✓",
                  title: "Multi-Provider Support",
                  description: "Use AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Huawei Cloud, or local providers.",
                },
                {
                  icon: "✓",
                  title: "Docker-Native Workflow",
                  description: "Works seamlessly with Docker Compose and standalone Docker hosts. No orchestrator required.",
                },
                {
                  icon: "✓",
                  title: "Minimal Resource Overhead",
                  description: "Uses less than 50MB RAM and 5% CPU during rotation. Negligible impact on running workloads.",
                },
                {
                  icon: "✓",
                  title: "Open Source & Independent",
                  description: "Apache 2.0 licensed. No platform lock-in. Full source code auditable on GitHub.",
                },
              ].map((capability, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-accent text-lg font-semibold flex-shrink-0 mt-0.5">{capability.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        {capability.title}
                      </h3>
                      <p className="text-xs text-secondary leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Architecture */}
            <div className="text-center pt-8">
              <p className="text-sm text-tertiary mb-3">
                Want to understand how these guarantees are implemented?
              </p>
              <a
                href="/architecture"
                className="text-accent hover:text-accent/80 font-medium transition-colors"
              >
                See Architecture →
              </a>
            </div>
          </div>
        </section>

        {/* Why DSO - Comparison */}
        <WhyDSO />

        {/* Tradeoffs - Explicit guidance */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Honest Tradeoffs
              </h2>
              <p className="text-lg text-secondary">
                DSO is the right choice for some teams. Not for others. Be honest about fit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Use DSO */}
              <div className="p-8 rounded-lg border border-green-500/30 bg-green-500/5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 font-bold">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Choose DSO If:</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "You run Docker Compose or standalone Docker hosts",
                    "You want fully automated rotation without ops overhead",
                    "You need zero-downtime guarantees",
                    "You prefer simple, focused tools over platforms",
                    "Your team knows Docker well but not Vault/Infisical",
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-green-400 font-bold flex-shrink-0">•</span>
                      <span className="text-secondary text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use alternatives */}
              <div className="p-8 rounded-lg border border-border bg-surface/30 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                    <span className="text-gray-400 font-bold">→</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Consider Alternatives If:</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "You run Kubernetes (use native solutions instead)",
                    "You need a complete secret management platform",
                    "You require team-based access controls",
                    "You need audit compliance (SOC2, ISO, etc.)",
                    "You want a managed SaaS offering",
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-gray-400 font-bold flex-shrink-0">•</span>
                      <span className="text-secondary text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps CTA */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ready to get started?
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Understand how DSO works, deploy it, or read the docs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <a
                href="/architecture"
                className="p-8 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  Architecture
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Learn how DSO's atomic swap, health checks, and checkpoint recovery work under the hood.
                </p>
                <span className="text-accent font-medium flex items-center gap-2">
                  Learn →
                </span>
              </a>

              <a
                href="/deploy"
                className="p-8 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  Deploy
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Install DSO on Docker Compose, AWS, Azure, HashiCorp Vault, or local environments.
                </p>
                <span className="text-accent font-medium flex items-center gap-2">
                  Deploy →
                </span>
              </a>

              <a
                href="/docs/getting-started"
                className="p-8 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  Docs
                </h3>
                <p className="text-sm text-secondary mb-4">
                  CLI reference, configuration, operational guides, and troubleshooting.
                </p>
                <span className="text-accent font-medium flex items-center gap-2">
                  Read →
                </span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
