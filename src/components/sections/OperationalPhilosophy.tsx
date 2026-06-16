"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Zap, RotateCcw } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const OperationalPhilosophy = () => {
  const principles = [
    {
      icon: AlertTriangle,
      title: "Failures Are Expected",
      description: "Networks partition. Providers timeout. Containers fail to start. DSO doesn't assume perfection.",
      detail: "Every layer has failure handling. Recovery is automatic. No manual intervention needed.",
      color: "yellow",
    },
    {
      icon: Shield,
      title: "Safety Over Speed",
      description: "A rotation that takes 3 seconds safely beats a rotation that takes 1 second unsafely.",
      detail: "Checkpoints allow recovery. Health checks prevent bad deploys. Atomic swaps prevent partial states.",
      color: "green",
    },
    {
      icon: RotateCcw,
      title: "Recovery Is Automatic",
      description: "If DSO crashes mid-rotation, it resumes, completes, or rolls back on restart. No operator action.",
      detail: "Checkpoint-based recovery means state is always consistent. Crashes don't cause data loss.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Consistency Matters More Than Performance",
      description: "DSO prefers correct state over fast state. Rotation takes 2-3 seconds; that's acceptable.",
      detail: "Fast rotation that fails is worse than slow rotation that succeeds. We optimize for reliability.",
      color: "accent",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <H2 className="mb-4">Operational Philosophy</H2>
          <PLead className="text-secondary">
            DSO's engineering principles shape every decision. Understanding them clarifies why it works the way it does.
          </PLead>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((principle, idx) => {
            const Icon = principle.icon;
            const colorMap = {
              yellow: "border-yellow-500/20 bg-yellow-500/5",
              green: "border-green-500/20 bg-green-500/5",
              blue: "border-blue-500/20 bg-blue-500/5",
              accent: "border-accent/20 bg-accent/5",
            };

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-lg border ${colorMap[principle.color as keyof typeof colorMap]}`}
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-foreground-alt mb-3 leading-relaxed">
                      {principle.description}
                    </p>
                    <p className="text-xs text-secondary leading-relaxed">
                      {principle.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Implementation Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl p-8 rounded-lg border border-border bg-surface/30 space-y-4"
        >
          <h3 className="font-semibold text-foreground text-lg">Example: Health Check Failure</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-4">
              <span className="text-accent font-bold flex-shrink-0 w-20">Philosophy:</span>
              <span className="text-foreground-alt">Safety over speed</span>
            </div>
            <div className="flex gap-4">
              <span className="text-accent font-bold flex-shrink-0 w-20">Implementation:</span>
              <span className="text-foreground-alt">
                New container fails health checks → rotation is rejected → old container stays active → no downtime
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-accent font-bold flex-shrink-0 w-20">Outcome:</span>
              <span className="text-foreground-alt">
                The system chooses consistency (keep old state) over convenience (force new state)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
