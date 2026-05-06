"use client";

import React from "react";
import { motion } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { ChevronRight } from "lucide-react";

const composeCode = `services:
  api:
    image: node:20-alpine
    environment:
      # DSO resolves this at runtime via AST injection
      - DB_PASSWORD=dso://production/db/password
      - API_KEY=dsofile:///run/secrets/api_key
    networks:
      - secure-mesh`;

export const ComposeExample = () => {
  return (
    <section className="py-12 sm:py-20 md:py-24 bg-background border-y border-white/5 relative overflow-hidden">
      {/* Background depth */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.3em] mb-4 sm:mb-6 font-bold">Key Integration</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 tracking-tight font-outfit leading-tight">
              One protocol. <br />
              Infinite possibilities.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed font-medium">
              DSO leverages the <code className="text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/20">dso://</code> protocol to intercept Docker Compose environment resolution. No code changes, no sidecars, no complexity.
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              {[
                { title: "Zero Image Bloat", desc: "Keep secrets out of your container images and build arguments." },
                { title: "Universal Compatibility", desc: "Works with any container that accepts env vars or file paths." },
                { title: "Atomic Injection", desc: "Secrets are injected during the 'create' phase of the container lifecycle." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 sm:mt-2 group-hover:scale-150 transition-transform shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base text-white font-bold mb-1 tracking-tight">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-accent/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <CodeSnippet 
                language="yaml" 
                code={composeCode} 
                fileName="docker-compose.yml"
              />
            </div>
            {/* Annotation */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-[#1a1f26] border border-white/10 shadow-xl hidden md:block max-w-[200px]"
            >
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                "The dso:// protocol is the cleanest way we've found to bridge local dev and production secrets."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
