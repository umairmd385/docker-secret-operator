import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InstallationTrust } from "@/components/sections/InstallationTrust";
import { DeploymentPaths } from "@/components/sections/DeploymentPaths";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Deploy | Docker Secret Operator",
    description:
      "Safely install DSO with verified checksums, signature verification, and manual installation paths. Guides for Docker Compose, AWS, Azure, Vault, Huawei Cloud, and local mode.",
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

        {/* Installation Trust - Verified Install First */}
        <InstallationTrust />

        {/* Deployment Paths - Provider Selection */}
        <DeploymentPaths />

        {/* What Happens Next */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                What Happens Next?
              </h2>
              <p className="text-lg text-secondary">
                After installation, understand operations, recovery, and configuration.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Health Check",
                  description: "Verify DSO agent is running and connected to your provider.",
                  href: "/docs/operations/health-checks",
                },
                {
                  title: "Operations Guide",
                  description: "Monitor rotations, configure notifications, and manage state.",
                  href: "/docs/operations/guide",
                },
                {
                  title: "Recovery Procedures",
                  description: "Handle failures, recover from crashes, and restore state.",
                  href: "/docs/recovery/procedures",
                },
                {
                  title: "CLI Reference",
                  description: "Complete reference for all dso commands and options.",
                  href: "/docs/cli/reference",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 flex flex-col gap-3 group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary flex-1">
                    {item.description}
                  </p>
                  <span className="text-accent font-medium text-sm">
                    Learn →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
