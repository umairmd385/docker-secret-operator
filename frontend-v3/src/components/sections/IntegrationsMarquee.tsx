"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Lock, Key, FileText, CloudRain, ShieldCheck, Zap, GitBranch } from "lucide-react";

export const IntegrationsMarquee = () => {
  const logos = [
    { icon: Database, label: "AWS Secrets Manager" },
    { icon: Lock, label: "HashiCorp Vault" },
    { icon: Key, label: "Azure Key Vault" },
    { icon: CloudRain, label: "Huawei Cloud CSMS" },
    { icon: FileText, label: "Local Filesystem" },
  ];

  // duplicate for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section id="integrations" className="py-24 overflow-hidden border-b border-border bg-surface2/30">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h3 className="text-xl font-bold text-foreground mb-2">Works with your existing secret providers</h3>
        <p className="text-gray-400 text-sm mb-8">Via the extensible Go plugin architecture</p>

        {/* Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { icon: ShieldCheck, label: "Zero Disk Persistence" },
            { icon: Zap, label: "Event-Driven" },
            { icon: GitBranch, label: "Checksum Verified" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent/80 text-xs font-mono tracking-wide">
              <Icon className="w-3 h-3" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-7xl flex flex-col items-center mx-auto overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex">
          <motion.div
            className="flex gap-16 pr-16 items-center"
            animate={{ x: ["0%", "-33.333333%"] }}
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity,
            }}
          >
            {duplicatedLogos.map((logo, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-500 shrink-0">
                <logo.icon className="w-8 h-8 opacity-80" />
                <span className="font-bold text-lg">{logo.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
