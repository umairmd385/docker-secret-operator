"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, GitBranch, Lock, CheckCircle2, Zap, AlertCircle } from "lucide-react";

export const ArchitectureOverview = () => {
  const layers = [
    {
      name: "Secrets Provider",
      description: "Source of truth for secrets",
      details: ["Vault", "AWS Secrets Manager", "Azure Key Vault", "Huawei Cloud KMS", "Local Vault"],
      icon: Lock,
    },
    {
      name: "DSO Agent",
      description: "Watches for changes, orchestrates rotation",
      details: ["Change detection", "Scheduler", "State machine", "Provider API client"],
      icon: Zap,
    },
    {
      name: "Checkpoint Manager",
      description: "Persistence layer for crash recovery",
      details: ["On-disk state tracking", "Rollback safety", "Consistency guarantees"],
      icon: GitBranch,
    },
    {
      name: "Validation Layer",
      description: "Ensures safety before swap",
      details: ["Health checks", "Connection verification", "Readiness validation"],
      icon: CheckCircle2,
    },
    {
      name: "Runtime Engine",
      description: "Executes container updates",
      details: ["Atomic swap", "Cleanup", "Failure handling"],
      icon: AlertCircle,
    },
    {
      name: "Application",
      description: "Consumes rotated secrets",
      details: ["Zero downtime", "No restart required", "Automatic reconnection"],
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            DSO is a layered system designed for reliability and safety. Each layer has a specific responsibility. Failures are handled gracefully at every stage.
          </p>
        </motion.div>

        {/* System Layers */}
        <div className="space-y-4 max-w-4xl">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-2"
              >
                {/* Layer Card */}
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {layer.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{layer.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.details.map((detail, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-xs px-2.5 py-1.5 rounded-full bg-accent/10 text-accent/90 border border-accent/20 font-mono"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {idx < layers.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx + 1) * 0.05 }}
                    className="flex justify-center py-2"
                  >
                    <ArrowDown className="w-5 h-5 text-accent/40" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Key Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl p-8 rounded-lg border border-accent/20 bg-accent/5 space-y-4"
        >
          <h3 className="font-semibold text-foreground text-lg">Architectural Principles</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Layered design:</span> Each layer handles one responsibility. Failures in one layer don't cascade.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Safety before speed:</span> Checkpoint-based recovery preferred over fast recovery. Consistency over performance.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Expected failures:</span> Every layer assumes downstream failures. Automatic recovery is built in.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">State persistence:</span> Checkpoints allow recovery from any failure point. State is always recoverable.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
