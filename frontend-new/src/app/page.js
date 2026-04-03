import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Quickstart } from "@/components/sections/Quickstart";
import { Architecture } from "@/components/sections/Architecture";
import { SecurityModel } from "@/components/sections/SecurityModel";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Quickstart />
      <Features />
      <Architecture />
      <SecurityModel />
      <CTASection />
      <Footer />
    </main>
  );
}
