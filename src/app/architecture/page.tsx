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

        <Footer />
      </div>
    </main>
  );
}
