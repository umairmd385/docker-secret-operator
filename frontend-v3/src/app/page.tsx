import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { WhyDSO } from "@/components/sections/WhyDSO";
import { DecisionMatrix } from "@/components/sections/DecisionMatrix";
import { RealWorldExample } from "@/components/sections/RealWorldExample";
import { Architecture } from "@/components/sections/Architecture";
import { ConfigDeepDive } from "@/components/sections/ConfigDeepDive";
import { FeaturesBento } from "@/components/sections/FeaturesBento";
import { QuickStartTabs } from "@/components/sections/QuickStartTabs";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative bg-[var(--background)]">
      {/* Subtle Partial Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none hidden md:block h-[800px]" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }} 
      />
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
      <Hero />
      <IntegrationsMarquee />
      <WhyDSO />
      <DecisionMatrix />
      <RealWorldExample />
      <ConfigDeepDive />
      <Architecture />
      <FeaturesBento />
        <QuickStartTabs />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
