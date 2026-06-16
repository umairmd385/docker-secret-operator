"use client";

import React from "react";
import { motion } from "framer-motion";
import { H2, P, PLead } from "@/components/ui/Typography";
import {
  RefreshCw,
  Zap,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface RecoveryStep {
  icon: React.ReactNode;
  label: string;
  description: string;
  detail: string;
}

const RecoveryStep = ({
  icon,
  label,
  description,
  detail,
  index,
}: RecoveryStep & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06, duration: 0.3 }}
    whileHover={{ x: 4, transition: { duration: 0.2 } }}
    className="space-y-3 transition-all duration-300"
    role="listitem"
    aria-label={`Step ${index + 1}: ${label}`}
  >
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface/20 transition-colors duration-300">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-accent/50">
        <div className="text-accent text-sm" aria-hidden="true">{icon}</div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm leading-snug">{label}</h4>
        <p className="text-xs text-secondary mt-1 leading-relaxed">{description}</p>
        <p className="text-[11px] text-tertiary mt-2 pl-3 border-l-2 border-accent/30 leading-relaxed">
          {detail}
        </p>
      </div>
    </div>

    {/* Connector */}
    {index < 5 && (
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: (index + 1) * 0.06, duration: 0.3 }}
        className="h-6 ml-4 border-l-2 border-accent/20 origin-top transition-colors duration-300"
        aria-hidden="true"
      />
    )}
  </motion.div>
);

export const CrashRecoveryStory = () => {
  const recoverySteps: RecoveryStep[] = [
    {
      icon: <RefreshCw className="w-4 h-4" />,
      label: "Rotation Begins",
      description: "DSO starts rotating a secret from the provider.",
      detail:
        "New container spawned. Health checks starting. Checkpoint created on disk.",
    },
    {
      icon: <HardDrive className="w-4 h-4" />,
      label: "Checkpoint Saved",
      description: "State persisted before critical operation.",
      detail:
        "Rotation step recorded: 'container spawned', 'health check in progress', or 'ready to swap'. File written to disk.",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Host Crashes",
      description: "Power loss, kernel panic, or operator restart.",
      detail:
        "All running containers stop. Memory is lost. Checkpoint file on disk survives.",
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      label: "DSO Restarts",
      description: "Host comes back online. DSO agent starts.",
      detail:
        "Reads checkpoint file. Evaluates: was rotation complete? Was it safe to continue? Or rollback?",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Resume or Rollback",
      description: "Automatic recovery decision made.",
      detail:
        "If rotation completed: mark done, cleanup old containers. If incomplete: rollback to previous state. If failed: restore from checkpoint.",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Operation Complete",
      description: "No orphaned containers. No stale secrets. State consistent.",
      detail:
        "Either new secret is active, or old secret is restored. Either way: guaranteed correct state. No manual recovery needed.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <H2 className="mb-4">Crash Recovery</H2>
          <PLead className="text-tertiary">
            Even failure is handled. DSO survives crashes and recovers consistently.
          </PLead>
        </motion.div>

        {/* Recovery flow */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-1">
            {recoverySteps.map((step, idx) => (
              <RecoveryStep
                key={idx}
                {...step}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Key guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="max-w-2xl mx-auto p-6 rounded-lg border border-green-500/30 bg-green-500/5 space-y-3 transition-all duration-300 hover:bg-green-500/10 hover:border-green-500/50 hover:shadow-lg"
          role="complementary"
          aria-label="Checkpoint-based recovery guarantee"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-green-500/20 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">
                Checkpoint-Based Recovery
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                Checkpoints on disk track rotation state. On restart, DSO evaluates
                the last checkpoint and either completes the rotation, resumes it, or
                rolls back safely. No manual intervention. No orphaned containers. State
                always consistent.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why this matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 rounded-lg border border-border bg-surface/30 space-y-3 transition-all duration-300 hover:bg-surface/50 hover:shadow-md"
            role="article"
            aria-label="Without checkpoints scenario"
          >
            <h4 className="font-semibold text-foreground text-sm">Without Checkpoints</h4>
            <p className="text-xs text-secondary leading-relaxed">
              Lost state after crash. Operator must manually detect orphaned
              containers and stale secrets. Risk of inconsistency.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 rounded-lg border border-accent/30 bg-accent/5 space-y-3 transition-all duration-300 hover:bg-accent/10 hover:border-accent/50 hover:shadow-md"
            role="article"
            aria-label="With DSO checkpoints scenario"
          >
            <h4 className="font-semibold text-foreground text-sm">With DSO Checkpoints</h4>
            <p className="text-xs text-secondary leading-relaxed">
              State persists. DSO auto-recovers. Zero manual intervention.
              Guaranteed consistent state.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
