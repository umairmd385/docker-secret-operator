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

        {/* 1. Hero - Elevated */}
        <Hero />

        {/* 2. The Problem - Story-driven */}
        <ProblemSection />

        {/* 3. Interactive Terminal Demo */}
        <TerminalDemo />

        {/* 4. How It Works - One elegant flow */}
        <HowItWorks />

        {/* 5. Crash Recovery - Hero feature elevated */}
        <CrashRecoveryStory />

        {/* 6. Product Preview - Dashboard & CLI */}
        <ProductPreview />

        {/* 7. Social Proof - Trust signals */}
        <OSSTrust />

        {/* 8. Final CTA */}
        <TrustAndCTA />

        <Footer />
      </div>
    </main>
  );
}
