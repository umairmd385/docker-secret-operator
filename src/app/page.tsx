import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SecretRotationFailures } from "@/components/sections/SecretRotationFailures";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ProductionWorkflow } from "@/components/sections/ProductionWorkflow";
import { QuickStartTabs } from "@/components/sections/QuickStartTabs";
import { FeaturedIntegrations } from "@/components/sections/FeaturedIntegrations";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = generatePageMetadata(PAGE_METADATA["/"], "/");

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        <Navbar />
        <Hero />
        <SecretRotationFailures />
        <TrustStrip />
        <WhyDSO />
        <ProductionWorkflow />
        <FeaturedIntegrations />
        <QuickStartTabs />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
