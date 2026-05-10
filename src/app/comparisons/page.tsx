import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { SectionHeader } from "@/components/branding/BrandHeader";

const comparisonsMetadata = {
  title: "Comparisons | Docker Secret Operator",
  description:
    "How DSO compares to other secret management solutions. Clear trade-offs and when to use DSO vs. alternatives.",
  keywords: [
    "dso comparison",
    "docker secret operator vs",
    "secret management comparison",
    "dso vs vault",
    "dso vs sealed secrets",
    "kubernetes secrets vs dso",
  ],
  ogTitle: "DSO vs. Other Solutions - Comparison Guide",
  ogDescription: "Understand how Docker Secret Operator compares to alternatives",
  ogImage: "/og-image.png",
};

export const metadata: Metadata = generatePageMetadata(
  comparisonsMetadata,
  "/comparisons"
);

const comparisons = [
  {
    name: "External Secrets Operator (ESO)",
    dso: "✓ Simpler API, CLI-first",
    them: "✓ Kubernetes-native, declarative",
    winner: "ESO if on Kubernetes",
    verdict:
      "ESO is purpose-built for Kubernetes. DSO is purpose-built for Docker Compose. Choose based on your orchestration platform.",
  },
  {
    name: "HashiCorp Vault",
    dso: "✓ Simpler setup, lighter weight",
    them: "✓ More features, audit logging, UI",
    winner: "Vault if you need enterprise features",
    verdict:
      "Vault is feature-rich and self-hosted. DSO is a lightweight client. Many teams run DSO with Vault as the backend.",
  },
  {
    name: "AWS Secrets Manager",
    dso: "✓ Multi-provider, portable",
    them: "✓ AWS-native, tightly integrated",
    winner: "Both, depending on lock-in tolerance",
    verdict:
      "ASM is AWS-only. DSO lets you switch providers or use multiple providers. Neither is strictly 'better'.",
  },
  {
    name: "Docker Secrets (Swarm)",
    dso: "✓ Works with Compose, modern",
    them: "✓ Built into Swarm, cluster-aware",
    winner: "Docker Secrets in Swarm clusters",
    verdict:
      "Docker Secrets are cluster-scoped (Swarm). DSO is container-scoped (Compose). Different use cases.",
  },
  {
    name: "Sealed Secrets",
    dso: "✓ Simpler, no Kubernetes dependency",
    them: "✓ Kubernetes-native, GitOps-ready",
    winner: "Sealed Secrets for Kubernetes GitOps",
    verdict:
      "Sealed Secrets are for Kubernetes + GitOps. DSO is for Docker + CLI. Both have their place.",
  },
  {
    name: "Environment Variables (.env files)",
    dso: "✓✓ Secure, zero-persistence, encrypted",
    them: "✗ Exposed via docker inspect, logged, not encrypted",
    winner: "Always choose DSO over .env files",
    verdict:
      "If you're using .env files, switching to DSO is a strict security upgrade with zero downsides.",
  },
];

export default function ComparisonsPage() {
  return (
    <main className="min-h-screen bg-background py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <SectionHeader
          title="Comparisons"
          description="How Docker Secret Operator stacks up against other secret management solutions"
          showLogo={false}
        />

        {/* Comparison Cards */}
        <div className="space-y-6 mb-16">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 p-6 hover:border-accent/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">
                {item.name}
              </h3>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                    DSO Advantage
                  </p>
                  <p className="text-gray-300">{item.dso}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Their Advantage
                  </p>
                  <p className="text-gray-300">{item.them}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-sm text-gray-400 mb-2">
                  <span className="font-semibold text-accent">Verdict:</span>{" "}
                  {item.winner}
                </p>
                <p className="text-sm text-gray-500">{item.verdict}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Matrix */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            Feature Comparison Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-bold text-foreground">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">
                    DSO
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">
                    ESO
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">
                    Vault
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">
                    Sealed Secrets
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Docker Compose Support", dso: "✓", eso: "✗", vault: "✓", sealed: "✗" },
                  { feature: "Kubernetes Support", dso: "✗", eso: "✓", vault: "✓", sealed: "✓" },
                  { feature: "Multi-Provider", dso: "✓", eso: "✓", vault: "✓", sealed: "✗" },
                  { feature: "Zero-Persistence", dso: "✓", eso: "✓", vault: "✓", sealed: "✓" },
                  { feature: "CLI-First", dso: "✓", eso: "✗", vault: "✓", sealed: "~" },
                  { feature: "Self-Hosted Option", dso: "✓", eso: "✓", vault: "✓", sealed: "✓" },
                  { feature: "Cloud-Native", dso: "~", eso: "✓", vault: "~", sealed: "✓" },
                  { feature: "Audit Logging", dso: "~", eso: "~", vault: "✓", sealed: "~" },
                  { feature: "Easy Setup", dso: "✓", eso: "~", vault: "~", sealed: "✓" },
                  { feature: "Learning Curve", dso: "✓", eso: "~", vault: "~", sealed: "✓" },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300 font-medium">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-accent font-bold">{row.dso}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400">
                      {row.eso}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400">
                      {row.vault}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400">
                      {row.sealed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            ✓ = Full support, ~ = Partial support, ✗ = Not supported
          </p>
        </section>

        {/* When to Use DSO */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            When to Use DSO
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-white/5 border border-accent/20 p-6">
              <h3 className="font-bold text-lg text-accent mb-4">
                DSO is Perfect For:
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Docker Compose deployments",
                  "Container-first, non-Kubernetes teams",
                  "Multiple cloud providers (no lock-in)",
                  "Development with Local Mode",
                  "CLI-driven operations",
                  "Lightweight secret management",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">
                Consider Alternatives If:
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "You're on Kubernetes → Use ESO",
                  "You need advanced audit logging → Use Vault",
                  "You're AWS-only → Consider ASM directly",
                  "You need GitOps integration → Use Sealed Secrets",
                  "You need a central UI → Use Vault or cloud console",
                  "You're not using containers → Different tools apply",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Decision Tree */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            Decision Tree
          </h2>

          <div className="rounded-lg border border-white/10 p-8 bg-white/5">
            <p className="text-gray-300 mb-6">
              <span className="font-bold text-white">Are you using Kubernetes?</span>
            </p>

            <div className="ml-6 space-y-6">
              <div>
                <p className="text-accent font-bold mb-3">→ YES</p>
                <p className="text-gray-400 mb-3">
                  Use <span className="font-semibold">External Secrets Operator (ESO)</span>.
                  It's purpose-built for Kubernetes clusters.
                </p>
              </div>

              <div>
                <p className="text-accent font-bold mb-3">→ NO (Docker Compose)</p>
                <p className="text-gray-400 mb-3">
                  <span className="font-semibold">Are you locked into one cloud provider?</span>
                </p>

                <div className="ml-6 space-y-6">
                  <div>
                    <p className="text-accent font-bold mb-2">→ YES (AWS-only)</p>
                    <p className="text-gray-400">
                      Use <span className="font-semibold">AWS Secrets Manager</span> directly,
                      or DSO as an abstraction layer.
                    </p>
                  </div>

                  <div>
                    <p className="text-accent font-bold mb-2">→ NO (Multi-cloud or flexibility)</p>
                    <p className="text-gray-400">
                      <span className="font-semibold">Use DSO</span>.
                      It gives you provider flexibility, zero-persistence, and simple CLI workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pt-12 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Ready to choose DSO?
          </h2>
          <p className="text-gray-400 mb-8">
            Start with Local Mode for development, then explore cloud integrations when
            ready for production.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/integrations"
              className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-background font-bold rounded-lg transition-colors text-center"
            >
              View Integrations
            </a>
            <a
              href="/examples"
              className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-bold rounded-lg transition-colors text-center"
            >
              See Examples
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
