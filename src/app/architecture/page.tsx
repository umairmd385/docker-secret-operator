import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RotationLifecycle } from "@/components/sections/RotationLifecycle";
import { RealWorldImpact } from "@/components/sections/RealWorldImpact";
import { SecurityArchitecture } from "@/components/sections/SecurityArchitecture";
import { CrashRecoveryStory } from "@/components/sections/CrashRecoveryStory";
import { SecretFlowStory } from "@/components/sections/SecretFlowStory";

export const metadata = generatePageMetadata(
  { ...PAGE_METADATA["/"], title: "Architecture | Docker Secret Operator" },
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
        <RotationLifecycle />
        <CrashRecoveryStory />
        <SecretFlowStory />
        <RealWorldImpact />
        <SecurityArchitecture />
        <Footer />
      </div>
    </main>
  );
}
