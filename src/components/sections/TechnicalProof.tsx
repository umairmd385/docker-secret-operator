"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Lock, Cloud, Zap } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface FeatureGroup {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: Feature[];
}

export const TechnicalProof = () => {
  const featureGroups: FeatureGroup[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Runtime",
      description: "Verified operational capabilities",
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
      description: "Verified protection mechanisms",
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
            Verified Implementation
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            All features backed by CLI source code. No claims without implementation.
          </p>
        </motion.div>

        {/* Feature Groups */}
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
                  <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
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

        {/* Proof Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-lg border border-accent/20 bg-accent/5 flex items-start gap-3"
        >
          <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Implementation-Backed Claims</p>
            <p className="text-xs text-gray-400">
              Every feature listed above is verified in the CLI source code. No marketing claims. No vaporware. Everything shown is production-ready and tested.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
