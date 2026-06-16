"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const SystemBoundaries = () => {
  const manages = [
    {
      item: "Secret rotation detection",
      explanation: "Watches provider for secret changes, triggers rotation automatically",
    },
    {
      item: "Container spawning",
      explanation: "Creates new containers with updated secrets from provider",
    },
    {
      item: "Health validation",
      explanation: "Runs configured health checks before traffic swap",
    },
    {
      item: "Atomic swap",
      explanation: "Renames containers at daemon level, switches traffic instantly",
    },
    {
      item: "Crash recovery",
      explanation: "Resumes, completes, or rolls back based on checkpoint state",
    },
    {
      item: "Checkpoint persistence",
      explanation: "Writes rotation state to disk for recovery after failures",
    },
    {
      item: "Docker API interaction",
      explanation: "Native Docker daemon integration, no dependencies",
    },
  ];

  const doesNotManage = [
    {
      item: "Kubernetes orchestration",
      explanation: "Designed for Docker Compose and standalone Docker hosts",
    },
    {
      item: "Multi-cluster management",
      explanation: "Operates on a single Docker daemon, not across clusters",
    },
    {
      item: "Secret storage",
      explanation: "Integrates with providers; doesn't store secrets",
    },
    {
      item: "Service discovery",
      explanation: "Assumes fixed container names and health check endpoints",
    },
    {
      item: "Audit logging",
      explanation: "Logs rotations; doesn't provide enterprise audit trail",
    },
    {
      item: "Role-based access",
      explanation: "No RBAC; runs on single Docker host",
    },
    {
      item: "UI/Web interface",
      explanation: "CLI-only; no dashboard or user management",
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
          <H2 className="mb-4">System Boundaries</H2>
          <PLead className="text-secondary">
            DSO has clear boundaries. Understanding what it manages—and what it doesn't—prevents misalignment.
          </PLead>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Manages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              DSO Manages
            </h3>
            <div className="space-y-3">
              {manages.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors"
                >
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {item.item}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {item.explanation}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Does NOT Manage */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <XCircle className="w-6 h-6 text-tertiary" />
              DSO Does NOT Manage
            </h3>
            <div className="space-y-3">
              {doesNotManage.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg border border-border bg-surface/30 hover:border-border-soft transition-colors"
                >
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {item.item}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {item.explanation}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Why This Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl p-8 rounded-lg border border-accent/20 bg-accent/5"
        >
          <h3 className="font-semibold text-foreground text-lg mb-3">Why Boundaries Matter</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Clear boundaries mean no false expectations. DSO is excellent at secret rotation in Docker environments. It is not a secret manager, not an orchestrator, not an enterprise platform.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If your use case falls within DSO's boundaries, you get a focused, simple tool. If it falls outside, you need a different solution. This clarity prevents wasted time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
