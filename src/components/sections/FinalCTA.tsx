"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ExternalLink } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden border-t border-emerald-500/20 bg-gradient-to-b from-background via-emerald-500/3 to-surface2/20">
      {/* Success emerald atmosphere for final CTA context */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(16,185,129,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-br from-emerald-500/8 via-accent/6 to-emerald-500/4 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] sm:text-xs font-mono text-accent/60 tracking-widest uppercase mb-6 sm:mb-8">
            ◆ GET STARTED TODAY ◆
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.2] sm:leading-[1.1] mb-6 sm:mb-8">
            Ready to secure your{" "}
            <span className="text-accent">Docker workloads?</span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 sm:mb-12 max-w-2xl mx-auto">
            Start using DSO and eliminate secret leakage from your containers. Production-safe in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button href="#quick-start" size="lg" className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg">
              Start Free Trial
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              href="https://github.com/docker-secret-operator/dso"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg"
            >
              Star on GitHub
              <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5 ml-2 opacity-60" />
            </Button>
          </div>

          <p className="mt-10 sm:mt-12 text-[9px] sm:text-xs font-mono text-muted-foreground tracking-wide px-2">
            ✓ AWS Secrets Manager · ✓ HashiCorp Vault · ✓ Azure Key Vault · ✓ Local Filesystem
          </p>
        </motion.div>
      </div>
    </section>
  );
};
