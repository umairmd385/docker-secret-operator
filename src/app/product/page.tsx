import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VerifiedCapabilities } from "@/components/sections/VerifiedCapabilities";
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

        {/* Operational Guarantees & Feature Matrix */}
        <VerifiedCapabilities />

        {/* Comparisons & Why DSO */}
        <WhyDSO />

        {/* Use Cases */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Common Use Cases
              </h2>
              <p className="text-lg text-gray-400">
                DSO excels at zero-downtime secret rotation for containerized workloads.
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
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Example: {useCase.example}
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
