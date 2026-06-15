"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Lock, Eye, Package, HeartPulse, RefreshCw, Trash2 } from "lucide-react";

interface StoryStep {
  icon: React.ReactNode;
  label: string;
  description: string;
  type: "warning" | "success";
}

const StepNode = ({
  icon,
  label,
  description,
  type,
  index,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  type: "warning" | "success";
  index: number;
  isActive: boolean;
}) => {
  const isWarning = type === "warning";
  const bgColor = isWarning
    ? "bg-red-500/10 border-red-500/30"
    : "bg-green-500/10 border-green-500/30";
  const iconColor = isWarning ? "text-red-400" : "text-green-400";
  const Icon = isWarning ? AlertCircle : CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative p-5 rounded-lg border transition-all duration-300 ${bgColor} hover:shadow-md ${
        isActive ? "ring-2 ring-accent/50" : ""
      }`}
      role="listitem"
      aria-label={`Step ${index + 1}: ${label}`}
    >
      {/* Step Number */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-col text-xs font-bold text-accent transition-all duration-300 hover:scale-110">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm leading-snug">{label}</h4>
            <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 ml-9 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Timeline = ({
  title,
  subtitle,
  steps,
  type,
}: {
  title: string;
  subtitle: string;
  steps: StoryStep[];
  type: "traditional" | "dso";
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            type === "traditional"
              ? "bg-red-500/10 border border-red-500/30"
              : "bg-green-500/10 border border-green-500/30"
          }`}
        >
          <div
            className={`text-lg ${
              type === "traditional" ? "text-red-400" : "text-green-400"
            }`}
          >
            {type === "traditional" ? "✗" : "✓"}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Steps with connecting lines */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx}>
            <StepNode
              icon={step.icon}
              label={step.label}
              description={step.description}
              type={step.type}
              index={idx}
              isActive={false}
            />

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 1) * 0.05, duration: 0.3 }}
                className={`h-2 ml-3 border-l-2 ${
                  step.type === "warning"
                    ? "border-red-500/30"
                    : "border-green-500/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const RotationStory = () => {
  const traditionalSteps: StoryStep[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "Secret Changes",
      description: "New password pushed to provider. Old container still running.",
      type: "warning",
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Manual Restart Required",
      description: "Operator must manually restart containers or run scripts.",
      type: "warning",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Connections Drop",
      description: "Container stops. Active requests fail. Load balancer notices downtime.",
      type: "warning",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Manual Recovery",
      description: "Operator must investigate, fix errors, retry manually.",
      type: "warning",
    },
  ];

  const dsoSteps: StoryStep[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "Detect Change",
      description: "DSO watches provider. Secret update detected automatically.",
      type: "success",
    },
    {
      icon: <Lock className="w-4 h-4" />,
      label: "Acquire Lock",
      description: "Prevent concurrent rotations. Only one attempt at a time.",
      type: "success",
    },
    {
      icon: <Package className="w-4 h-4" />,
      label: "Spawn Container",
      description: "Create new container with updated secret from provider.",
      type: "success",
    },
    {
      icon: <HeartPulse className="w-4 h-4" />,
      label: "Validate Health",
      description: "Run configured health checks. Wait for readiness. Timeout is configurable.",
      type: "success",
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      label: "Atomic Swap",
      description: "Rename containers. Traffic switches instantly. No dropped connections.",
      type: "success",
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Cleanup",
      description: "Old container stops. Secrets purged from memory. Lock released.",
      type: "success",
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
            How Zero-Downtime Rotation Works
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            The critical difference between manual rotation and DSO's automatic approach.
          </p>
        </motion.div>

        {/* Side-by-side timelines */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Timeline
              title="Without DSO"
              subtitle="Manual intervention creates downtime and operational risk"
              steps={traditionalSteps}
              type="traditional"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Timeline
              title="With DSO"
              subtitle="Fully automated. Traffic never interrupted. Automatic rollback on failure."
              steps={dsoSteps}
              type="dso"
            />
          </motion.div>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="max-w-2xl mx-auto p-6 rounded-lg border border-accent/30 bg-accent/5 space-y-3 transition-all duration-300 hover:bg-accent/10 hover:border-accent/50 hover:shadow-lg"
          role="complementary"
          aria-label="Key insight about atomic swap mechanism"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-accent/20 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">
                The Atomic Swap
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                DSO renames containers at the Docker daemon level. Traffic switches instantly.
                Old container stops only after new one is fully healthy. Zero dropped connections.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
