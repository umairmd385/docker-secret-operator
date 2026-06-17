import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { TargetAudience } from "@/components/sections/TargetAudience";
import { FailureHandling } from "@/components/sections/FailureHandling";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { FAQSection } from "@/components/sections/FAQSection";
import { InstallationSimple } from "@/components/sections/InstallationSimple";
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

        {/* 1. Hero - Value proposition */}
        <Hero />

        {/* 2. Problem - Pain and urgency (restored) */}
        <ProblemSection />

        {/* 3. Terminal Demo - Immediate excitement & proof of speed */}
        <TerminalDemo />

        {/* 4. Product Preview - Build confidence in the product */}
        <ProductPreview />

        {/* 5. Target Audience - Fit assessment (after product proof) */}
        <TargetAudience />

        {/* 6. Failure Handling - Discuss failures after building confidence */}
        <FailureHandling />

        {/* 7. Comparison Table - Why DSO over alternatives */}
        <WhyDSO />

        {/* 8. FAQ - Remaining objections */}
        <FAQSection />

        {/* 9. Installation - Getting started */}
        <InstallationSimple />

        {/* 10. Final CTA + Trust signals */}
        <TrustAndCTA />

        <Footer />
      </div>
    </main>
  );
}
