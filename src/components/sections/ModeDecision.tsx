"use client";

import React from "react";
import { motion } from "framer-motion";
import { Laptop, Cloud, Check } from "lucide-react";

export const ModeDecision = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Local vs Cloud: When to use what?</h2>
          <p className="text-gray-400">DSO v3.2 adapts to your environment automatically.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Local Mode */}
          <div className="p-8 rounded-3xl border border-border bg-surface/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Laptop className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Local Mode</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Standalone development on macOS/Windows/Linux",
                "Air-gapped or offline environments",
                "CI/CD pipelines without cloud access",
                "Minimalist setups (no root/systemd required)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Cloud Mode */}
          <div className="p-8 rounded-3xl border border-border bg-surface/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Cloud Mode</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Production stacks with AWS/Azure/Vault",
                "Automated secret rotation across teams",
                "Centralized governance and audit logs",
                "Multi-node Docker standalone environments"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
