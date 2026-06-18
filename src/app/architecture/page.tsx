import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArchitectureOverview } from "@/components/sections/ArchitectureOverview";
import { CrashRecoveryStory } from "@/components/sections/CrashRecoveryStory";
import { FailureScenarios } from "@/components/sections/FailureScenarios";
import { SystemBoundaries } from "@/components/sections/SystemBoundaries";
import { OperationalPhilosophy } from "@/components/sections/OperationalPhilosophy";

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
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        <Navbar />

        {/* 1. System Overview - High-level architecture */}
        <ArchitectureOverview />

        {/* 2. Rotation Lifecycle - Request flow with detailed steps */}
        <CrashRecoveryStory />

        {/* 3. Failure Handling - Real scenarios and recovery */}
        <FailureScenarios />

        {/* 4. System Boundaries - What DSO manages and doesn't */}
        <SystemBoundaries />

        {/* 5. Operational Philosophy - Engineering principles */}
        <OperationalPhilosophy />

        {/* 6. What Next - Navigation to related resources */}
        <section className="relative py-20 sm:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                What Next?
              </h2>
              <p className="text-lg text-secondary">
                Understand how to operate DSO, recover from failures, and use it effectively.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Operations Guide",
                  description: "How to run DSO in production, monitor rotations, and handle issues.",
                  href: "/docs/guide/operational-guide",
                },
                {
                  title: "Recovery Procedures",
                  description: "Step-by-step procedures for handling failures and recovering state.",
                  href: "/docs/guide/RECOVERY_PROCEDURES",
                },
                {
                  title: "CLI Reference",
                  description: "Command-line interface reference with all available commands and options.",
                  href: "/docs/cli",
                },
                {
                  title: "Deploy",
                  description: "Installation instructions for Docker Compose, AWS, Azure, Vault, and local.",
                  href: "/deploy",
                },
              ].map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.href}
                  className="group p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 flex flex-col gap-3"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-secondary flex-1">
                    {resource.description}
                  </p>
                  <span className="text-accent font-medium text-sm">
                    Explore →
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
