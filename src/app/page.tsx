import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CrashRecoveryStory } from "@/components/sections/CrashRecoveryStory";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { InstallationSimple } from "@/components/sections/InstallationSimple";
import { FAQSection } from "@/components/sections/FAQSection";
import { OSSTrust } from "@/components/sections/OSSTrust";
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

        {/* 3. Interactive Terminal Demo - Excitement peak */}
        <TerminalDemo />

        {/* 4. Crash Recovery - Trust (why it's safe) - MOVED UP */}
        <CrashRecoveryStory />

        {/* 5. How It Works - Understanding (after trust is built) */}
        <HowItWorks />

        {/* 6. Product Preview - Confidence (they can see it works) */}
        <ProductPreview />

        {/* 7. Why DSO - Outcomes-focused comparison */}
        <WhyDSO />

        {/* 8. FAQ - Clarity (handle remaining objections) */}
        <FAQSection />

        {/* 9. Social Proof - Trust signals before action */}
        <OSSTrust />

        {/* 10. Installation - Clear path to action */}
        <InstallationSimple />

        {/* 11. Final CTA - Confidence push */}
        <TrustAndCTA />

        <Footer />
      </div>
    </main>
  );
}
