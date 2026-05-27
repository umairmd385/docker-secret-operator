"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, HeartPulse, RotateCcw, Zap, Shield, AlertCircle } from "lucide-react";

interface GuaranteeItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GuaranteeCardComponent = ({ icon, title, description, index }: GuaranteeItem & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="p-4 sm:p-5 rounded-lg border border-accent/20 bg-accent/5"
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

export const OperationalGuarantees = () => {
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

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Operational Guarantees
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Every rotation is atomic, recoverable, and validated. Built-in safeguards prevent partial states and data loss.
          </p>
        </motion.div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guarantees.map((guarantee, index) => (
            <GuaranteeCardComponent key={guarantee.title} {...guarantee} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
