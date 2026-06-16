import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TargetAudience } from "@/components/sections/TargetAudience";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { CrashRecoveryStory } from "@/components/sections/CrashRecoveryStory";
import { FailureScenarios } from "@/components/sections/FailureScenarios";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { InstallationSimple } from "@/components/sections/InstallationSimple";
import { FAQSection } from "@/components/sections/FAQSection";
import { TrustAndCTA } from "@/components/sections/TrustAndCTA";

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

        {/* 1. Hero - Curiosity spark */}
        <Hero />

        {/* 2. The Problem - Recognition (users see their pain) */}
        <ProblemSection />

        {/* 2.5. Target Audience - Clarity on fit */}
        <TargetAudience />

        {/* 3. Interactive Terminal Demo - Excitement peak */}
        <TerminalDemo />

        {/* 4. Crash Recovery - Trust (why it's safe) */}
        <CrashRecoveryStory />

        {/* 5. Failure Scenarios - Proof of robustness */}
        <FailureScenarios />

        {/* 6. Product Preview - Confidence (they can see it works) */}
        <ProductPreview />

        {/* 7. Comparison Table - Why DSO over alternatives */}
        <WhyDSO />

        {/* 8. Target Audience - moved after comparison */}
        <TargetAudience />

        {/* 9. FAQ - 6 questions only */}
        <FAQSection />

        {/* 10. Installation */}
        <InstallationSimple />

        {/* 11. Final CTA */}
        <TrustAndCTA />

        <Footer />
      </div>
    </main>
  );
}
