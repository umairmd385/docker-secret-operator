"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Lock, Cloud, Zap, HeartPulse, RotateCcw, Shield, AlertCircle } from "lucide-react";

interface GuaranteeItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureGroup {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: Array<{ title: string; description: string }>;
}

const GuaranteeCard = ({ icon, title, description, index }: GuaranteeItem & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    className="p-4 rounded-lg border border-accent/20 bg-accent/5"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <div className="text-accent text-sm">{icon}</div>
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  </motion.div>
);

export const VerifiedCapabilities = () => {
  const guarantees: GuaranteeItem[] = [
    {
      icon: <Lock className="w-4 h-4" />,
      title: "Zero Disk Persistence",
      description: "Secrets never written to host filesystem. No plaintext traces on disk.",
    },
    {
      icon: <HeartPulse className="w-4 h-4" />,
      title: "Health Validation",
      description: "New container must pass health checks before traffic swap. Configurable timeout.",
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      title: "Automatic Rollback",
      description: "If health check fails, restore previous container instantly. Zero downtime.",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Zero Downtime",
      description: "Traffic swaps safely. No connections dropped. Atomic container rename.",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Atomic Swap",
      description: "Old container renamed to backup, new becomes active. No partial states.",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      title: "Crash Recovery",
      description: "Agent restart from clean state. In-memory cache persists until container stops.",
    },
  ];

  const featureGroups: FeatureGroup[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Runtime",
      description: "Operational capabilities",
      features: [
        { title: "Zero-Downtime Rotation", description: "Atomic container swap. No connection drops." },
        { title: "Health Validation", description: "Configurable health checks before traffic switch." },
        { title: "Automatic Rollback", description: "Failed rotation restores previous container instantly." },
        { title: "Multi-Container Support", description: "Rotate multiple containers in parallel." },
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Security",
      description: "Protection mechanisms",
      features: [
        { title: "Zero Disk Persistence", description: "Secrets never touch filesystem. Memory-only flow." },
        { title: "Atomic Injection", description: "TAR streamed to tmpfs. All-or-nothing guarantee." },
        { title: "Instant Cleanup", description: "Old container secrets purged immediately on rotation." },
        { title: "Encryption at Rest", description: "Local vault encrypted. Supports provider encryption." },
      ],
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Providers",
      description: "Verified integrations",
      features: [
        { title: "AWS Secrets Manager", description: "IAM Instance Profile auth. No credentials needed." },
        { title: "Azure Key Vault", description: "Managed Identity auth. Enterprise-ready." },
        { title: "HashiCorp Vault", description: "AppRole or token auth. Self-hosted or Cloud." },
        { title: "Local Encrypted Vault", description: "Zero-dependency option for development/offline." },
      ],
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Verified Capabilities
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Operational guarantees backed by implementation. All features verified in CLI source code.
          </p>
        </motion.div>

        {/* Guarantees Section */}
        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl font-bold text-foreground max-w-3xl"
          >
            Operational Guarantees
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guarantees.map((guarantee, index) => (
              <GuaranteeCard key={guarantee.title} {...guarantee} index={index} />
            ))}
          </div>
        </div>

        {/* Implementation Details Section */}
        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl font-bold text-foreground max-w-3xl"
          >
            Implementation-Backed Features
          </motion.h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {featureGroups.map((group, groupIdx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: groupIdx * 0.15 }}
                className="space-y-6"
              >
                {/* Group Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <div className="text-accent">{group.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{group.description}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  {group.features.map((feature, featureIdx) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: groupIdx * 0.15 + featureIdx * 0.08 }}
                      className="p-3 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/20 transition-colors"
                    >
                      <h4 className="font-medium text-foreground text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Proof Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-lg border border-accent/20 bg-accent/5 flex items-start gap-3"
        >
          <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">No Marketing Claims</p>
            <p className="text-xs text-gray-400">
              Every feature listed above is verified in the DSO CLI source code. No vaporware. No unimplemented features. Everything shown is production-ready and tested.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
