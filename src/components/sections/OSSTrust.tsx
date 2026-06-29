"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Lock, Cloud, Code, Users } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TrustCardComponent = ({ icon, title, description, index }: TrustItem & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="p-6 sm:p-8 rounded-lg border border-accent/20 bg-accent/5 text-center"
  >
    <div className="flex justify-center mb-4">
      <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
        <div className="text-accent">{icon}</div>
      </div>
    </div>
    <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
    <p className="text-sm text-secondary">{description}</p>
  </motion.div>
);

export const OSSTrust = () => {
  const trustItems: TrustItem[] = [
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Open Source",
      description: "Fully auditable source code on GitHub. No closed-source extensions or proprietary agents.",
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Docker Native",
      description: "Built for Docker Compose and single-host workloads. Works with your existing stack.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero Persistence",
      description: "Secrets never written to disk. Runtime-only injection with automatic cleanup on stop.",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "CLI Driven",
      description: "Infrastructure as code friendly. All features via docker dso CLI commands.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "5 Providers",
      description: "AWS, Azure, HashiCorp Vault, Huawei Cloud CSMS, Local. Provider-agnostic design.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <H2 className="mb-4">Built on Trust</H2>
          <PLead className="text-tertiary">
            Open source, Docker native, and community-driven. Transparency at every level.
          </PLead>
        </motion.div>

        {/* Trust Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {trustItems.map((item, index) => (
            <TrustCardComponent key={item.title} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
