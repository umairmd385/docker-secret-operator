"use client";

import React from "react";
import { motion } from "framer-motion";
import { H2, P } from "@/components/ui/Typography";
import {
  Eye,
  Lock,
  Save,
  Play,
  CheckCircle2,
  ArrowRight,
  Trash2,
} from "lucide-react";

interface LifecycleStep {
  icon: React.ReactNode;
  label: string;
  technical: string;
}

const LifecycleStep = ({
  icon,
  label,
  technical,
  index,
}: LifecycleStep & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.25 }}
    className="flex flex-col items-center gap-3"
  >
    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
      <div className="text-accent">{icon}</div>
    </div>
    <div className="text-center">
      <h4 className="font-semibold text-foreground text-sm">{label}</h4>
      <p className="text-xs text-secondary mt-1 max-w-[120px]">{technical}</p>
    </div>

    {/* Arrow to next step */}
    {index < 6 && (
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: (index + 0.5) * 0.05, duration: 0.25 }}
        className="w-8 h-0.5 bg-accent/30 origin-left mt-2"
      >
        <ArrowRight className="w-4 h-4 text-accent absolute mt-[-7px] ml-[32px]" />
      </motion.div>
    )}
  </motion.div>
);

export const RequestLifecycle = () => {
  const steps: LifecycleStep[] = [
    {
      icon: <Eye className="w-6 h-6" />,
      label: "Detect",
      technical: "Provider change detected via watcher or poll",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      label: "Lock",
      technical: "Acquire distributed lock to prevent concurrent rotations",
    },
    {
      icon: <Save className="w-6 h-6" />,
      label: "Checkpoint",
      technical: "Save rotation state to persistent storage",
    },
    {
      icon: <Play className="w-6 h-6" />,
      label: "Spawn",
      technical: "Launch container with new secrets from provider",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      label: "Health Check",
      technical: "Validate container readiness and health signals",
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      label: "Swap",
      technical: "Atomically switch container to new secret version",
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      label: "Cleanup",
      technical: "Remove old container and release lock",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="max-w-3xl mx-auto">
          <H2>Request Lifecycle</H2>
          <P className="mt-4">
            Core rotation operation from secret change detection to completion. Each step is atomic and checkpointed for recovery.
          </P>
        </div>

        {/* Flow Diagram */}
        <div className="overflow-x-auto">
          <div className="flex justify-between items-start gap-4 min-w-max px-6 py-8 bg-surface/30 border border-border rounded-lg">
            {steps.map((step, idx) => (
              <LifecycleStep key={idx} {...step} index={idx} />
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Guarantees</h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Atomic: Rotation succeeds completely or reverts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Recoverable: Checkpoint allows resume after crash</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Zero-downtime: Old container runs until swap</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Isolated: Secrets never touch disk during rotation</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Failure Handling</h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Health check fails: Rollback to old container</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Agent crash: Checkpoint allows safe resume</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Provider unavailable: Retry with exponential backoff</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Swap fails: Previous version remains running</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
