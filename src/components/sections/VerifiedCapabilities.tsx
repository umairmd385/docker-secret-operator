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
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="p-5 rounded-lg border border-accent/30 bg-accent/5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
    role="article"
    aria-label={title}
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 hover:scale-110 hover:border-accent/50">
        <div className="text-accent text-sm" aria-hidden="true">{icon}</div>
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-sm mb-2 leading-snug">{title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

export const VerifiedCapabilities = () => {
  const guarantees: GuaranteeItem[] = [
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Atomic Swap",
      description: "Rename containers at the Docker daemon level. Traffic switches instantly. No dropped connections.",
    },
    {
      icon: <HeartPulse className="w-4 h-4" />,
      title: "Health Validation",
      description: "New container must pass health checks before traffic moves. Configurable timeout.",
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      title: "Instant Recovery",
      description: "If health check fails, restore previous container immediately. Old container never stops until new one is healthy.",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      title: "Crash Recovery",
      description: "Checkpoints on disk track rotation state. On restart, DSO resumes, completes, or rolls back safely.",
    },
  ];

  const featureGroups: FeatureGroup[] = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Security",
      description: "Memory-only secrets",
      features: [
        { title: "Zero Disk Persistence", description: "Secrets exist only in memory during rotation. Never on disk." },
        { title: "Instant Cleanup", description: "Old container stops. Secrets purged from memory immediately." },
        { title: "Encryption at Rest", description: "Encrypted vault. Local and provider encryption supported." },
      ],
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Providers",
      description: "Major cloud platforms",
      features: [
        { title: "AWS Secrets Manager", description: "IAM Instance Profile auth. No credentials to manage." },
        { title: "Azure Key Vault", description: "Managed Identity auth. Enterprise-ready." },
        { title: "HashiCorp Vault", description: "AppRole or token auth. Self-hosted or managed." },
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
            How DSO Solves the Rotation Problem
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Four operational guarantees that eliminate downtime, prevent manual intervention, and ensure reliability. Every capability is verified in source code.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                      transition={{ delay: groupIdx * 0.08 + featureIdx * 0.04, duration: 0.3 }}
                      className="p-3 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
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
            <p className="text-sm font-semibold text-foreground mb-1">Verified Implementation</p>
            <p className="text-xs text-gray-400">
              Every capability shown here is production-ready and verified in the DSO CLI source code. For the complete feature list and advanced options, see the <a href="/docs/cli" className="text-accent hover:underline">CLI documentation</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
