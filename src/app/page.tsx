import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroNew } from "@/components/sections/HeroNew";
import { MetricsStrip } from "@/components/sections/MetricsStrip";
import { WhySecretsFail } from "@/components/sections/WhySecretsFail";
import { HowDSOWorks } from "@/components/sections/HowDSOWorks";
import { SecretLifecycle } from "@/components/sections/SecretLifecycle";
import { KeyCapabilities } from "@/components/sections/KeyCapabilities";
import { ProviderEcosystem } from "@/components/sections/ProviderEcosystem";
import { CLIExperience } from "@/components/sections/CLIExperience";
import { SecurityGuarantees } from "@/components/sections/SecurityGuarantees";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = generatePageMetadata(PAGE_METADATA["/"], "/");

export default function Home() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      {/* Global ambient background — fixed, behind all content */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1000px",
            height: "600px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "700px",
            height: "600px",
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroNew />
        <MetricsStrip />
        <WhySecretsFail />
        <HowDSOWorks />
        <SecretLifecycle />
        <KeyCapabilities />
        <ProviderEcosystem />
        <CLIExperience />
        <SecurityGuarantees />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
