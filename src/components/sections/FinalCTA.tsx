"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ExternalLink } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="relative py-12 sm:py-20 md:py-24 overflow-hidden border-t border-border">
      {/* Background: slightly darker surface with layered radial glows */}
      <div className="absolute inset-0 bg-[#060a0f] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-accent/15 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] sm:text-xs font-mono text-accent/60 tracking-widest uppercase mb-4 sm:mb-6">
            Open Source · Apache 2.0 Licensed
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6">
            Ready to secure your{" "}
            <span className="text-accent">Docker workloads?</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto">
            Start using DSO and eliminate secret leakage from your containers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button href="#quick-start" size="lg" className="group w-full sm:w-auto min-w-[200px] sm:min-w-[220px]">
              Start using DSO in 30 seconds
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              href="https://github.com/docker-secret-operator/dso"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
            >
              View Documentation
              <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 ml-2 opacity-60" />
            </Button>
          </div>

          <p className="mt-8 sm:mt-10 text-[9px] sm:text-xs font-mono text-gray-600 tracking-wide px-2">
            Works with AWS Secrets Manager · HashiCorp Vault · Azure Key Vault · Local Filesystem
          </p>
        </motion.div>
      </div>
    </section>
  );
};
