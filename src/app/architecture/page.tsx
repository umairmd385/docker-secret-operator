import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArchitectureOverview } from "@/components/sections/ArchitectureOverview";
import { ArchitectureDiagram } from "@/components/sections/ArchitectureDiagram";
import { RequestLifecycle } from "@/components/sections/RequestLifecycle";
import { SystemScope } from "@/components/sections/SystemScope";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Architecture | Docker Secret Operator",
    description:
      "Deep technical dive into DSO architecture. Component responsibilities, failure modes, recovery mechanisms, and design principles.",
  },
  "/architecture"
);

export default function ArchitecturePage() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "900px", height: "500px", background: "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "600px", height: "500px", background: "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* 1. System Overview - High-level architecture */}
        <ArchitectureOverview />

        {/* 2. Architecture Diagram - Visual system flow */}
        <ArchitectureDiagram />

        {/* 3. Request Lifecycle - Core operation flow */}
        <RequestLifecycle />

        {/* 4. System Scope - What DSO manages and doesn't */}
        <SystemScope />

        {/* What Next */}
        <section className="py-20 sm:py-28" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Next steps</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4" style={{ color: "#F8FAFC" }}>
                Explore further
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Understand how to operate DSO, recover from failures, and use it effectively.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                { title: "Operations Guide", description: "Run DSO in production, monitor rotations, and handle issues.", href: "/docs/guide/operational-guide" },
                { title: "Recovery Procedures", description: "Step-by-step procedures for handling failures and restoring state.", href: "/docs/guide/RECOVERY_PROCEDURES" },
                { title: "CLI Reference", description: "All available commands and options with examples.", href: "/docs/cli" },
                { title: "Deploy", description: "Install on Docker Compose, AWS, Azure, Vault, and local.", href: "/deploy" },
              ].map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.href}
                  className="group p-6 rounded-2xl flex flex-col gap-3 no-underline transition-all duration-300 hover:border-accent/30 hover:bg-accent/5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <h3 className="font-semibold text-sm" style={{ color: "#F8FAFC" }}>{resource.title}</h3>
                  <p className="text-sm flex-1 leading-relaxed" style={{ color: "#94A3B8" }}>{resource.description}</p>
                  <span className="text-sm font-medium" style={{ color: "#00E6C0" }}>Explore →</span>
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
