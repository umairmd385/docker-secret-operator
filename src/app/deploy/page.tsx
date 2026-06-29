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
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "900px", height: "500px", background: "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "600px", height: "500px", background: "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Installation Trust - Verified Install First */}
        <InstallationTrust />

        {/* Deployment Paths - Provider Selection */}
        <DeploymentPaths />

        {/* What Happens Next */}
        <section className="py-20 sm:py-28" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>After install</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                What happens next?
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                After installation, understand operations, recovery, and configuration.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Getting Started", description: "Quick start guide to deploy your first rotation.", href: "/docs/guide/getting-started" },
                { title: "Operations Guide", description: "Monitor rotations, configure notifications, and manage state.", href: "/docs/guide/operational-guide" },
                { title: "Recovery Procedures", description: "Handle failures, recover from crashes, and restore state.", href: "/docs/guide/RECOVERY_PROCEDURES" },
                { title: "CLI Reference", description: "Complete reference for all dso commands and options.", href: "/docs/cli" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="p-6 rounded-2xl flex flex-col gap-3 no-underline transition-all duration-300 hover:border-accent/30 hover:bg-accent/5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <h3 className="font-semibold text-sm" style={{ color: "#F8FAFC" }}>{item.title}</h3>
                  <p className="text-sm flex-1 leading-relaxed" style={{ color: "#94A3B8" }}>{item.description}</p>
                  <span className="text-sm font-medium" style={{ color: "#00E6C0" }}>Learn →</span>
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
