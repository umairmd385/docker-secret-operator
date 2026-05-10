import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { TrustSignals } from "@/components/sections/TrustSignals";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { ModeDecision } from "@/components/sections/ModeDecision";
import { ComposeExample } from "@/components/sections/ComposeExample";
import { Architecture } from "@/components/sections/Architecture";
import { FeaturesBento } from "@/components/sections/FeaturesBento";
import { QuickStartTabs } from "@/components/sections/QuickStartTabs";
import { FeaturedIntegrations } from "@/components/sections/FeaturedIntegrations";
import { TrustVerification } from "@/components/sections/TrustVerification";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = generatePageMetadata(PAGE_METADATA["/"], "/");

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        <Hero />
        <TrustStrip />
        
        <div className="flex flex-col">
          <TrustSignals />
          <ProblemSolution />
          <WhyDSO />
          <FeaturedIntegrations />
          <TrustVerification />
          <ModeDecision />
          <ComposeExample />
          <Architecture />
          <FeaturesBento />
          <QuickStartTabs />
          <FinalCTA />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
