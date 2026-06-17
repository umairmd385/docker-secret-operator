import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { WhyDSOExists } from "@/components/sections/WhyDSOExists";
import { BuiltForFailures } from "@/components/sections/BuiltForFailures";
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

        {/* 2. Problem - Context (tightened) */}
        <ProblemSection />

        {/* 3. Terminal Demo - Proof of concept */}
        <TerminalDemo />

        {/* 4. Product Preview - How it works */}
        <ProductPreview />

        {/* 5. Why DSO Exists - Philosophy (not comparison) */}
        <WhyDSOExists />

        {/* 6. Built for Failures - Safety promise + link to Architecture */}
        <BuiltForFailures />

        {/* 7. Installation - Options (simplified) */}
        <InstallationSimple />

        {/* 8. Trust & CTA - Confidence + action */}
        <TrustAndCTA />

        <Footer />
      </div>
    </main>
  );
}
