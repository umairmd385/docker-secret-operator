"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Zap,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { H2, H3, PLead, P, PSmall } from "@/components/ui/Typography";

export const FailureHandling = () => {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(0);

  const scenarios = [
    {
      title: "Host Crash",
      icon: <Zap className="w-6 h-6" />,
      problem: "Power loss, kernel panic, or operator restart",
      dsoResponse: [
        "DSO checkpoint file survives on disk",
        "Host comes back online, DSO agent restarts",
        "Reads checkpoint, evaluates rotation state",
        "Automatically completes, resumes, or rolls back",
        "State guaranteed consistent, no manual recovery needed",
      ],
      outcome: "Automatic recovery, zero manual intervention",
    },
    {
      title: "Provider Timeout",
      icon: <AlertCircle className="w-6 h-6" />,
      problem: "Secret provider is slow or temporarily unavailable",
      dsoResponse: [
        "Automatic retry with exponential backoff",
        "Old secret stays active (no interruption)",
        "Alerts sent to monitoring system",
        "Next rotation attempted on schedule",
        "Service continues, users unaware",
      ],
      outcome: "Zero downtime, graceful degradation",
    },
    {
      title: "Health Check Failure",
      icon: <AlertCircle className="w-6 h-6" />,
      problem: "New container fails to pass health checks",
      dsoResponse: [
        "Checkpoint marks container unhealthy",
        "Old container remains active serving traffic",
        "New container terminated cleanly",
        "No swap occurs (safety guarantee)",
        "Retry on next scheduled rotation",
      ],
      outcome: "No downtime, automatic rollback",
    },
    {
      title: "Container Startup Failure",
      icon: <AlertCircle className="w-6 h-6" />,
      problem: "Docker daemon fails to start new container",
      dsoResponse: [
        "DSO detects spawn failure immediately",
        "Old container continues active",
        "Cleanup routine removes failed container",
        "Checkpoint marks state as incomplete",
        "Next rotation will retry with fresh attempt",
      ],
      outcome: "No impact to running service",
    },
    {
      title: "DSO Agent Crash",
      icon: <RotateCcw className="w-6 h-6" />,
      problem: "DSO process crashes mid-rotation",
      dsoResponse: [
        "Checkpoint persists on disk (survives crash)",
        "On restart, DSO reads checkpoint",
        "Evaluates: was rotation complete or incomplete?",
        "If incomplete: resumes safely or rolls back",
        "State guaranteed consistent regardless",
      ],
      outcome: "Automatic recovery, no manual intervention",
    },
    {
      title: "Network Partition",
      icon: <AlertCircle className="w-6 h-6" />,
      problem: "Host loses connection to secret provider",
      dsoResponse: [
        "Rotation detection still works (local change)",
        "Provider connection fails during fetch",
        "Automatic retry while old secret active",
        "No partial states possible (atomic)",
        "Reconnects and retries automatically",
      ],
      outcome: "Delayed rotation, zero downtime",
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
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <H2>Failure Handling</H2>
          </div>
          <PLead className="text-tertiary">
            Failures are expected. DSO survives crashes and handles them gracefully.
          </PLead>
        </motion.div>

        {/* Scenario Selector */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((scenario, idx) => (
            <motion.button
              key={idx}
              onClick={() => setExpandedScenario(expandedScenario === idx ? null : idx)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                expandedScenario === idx
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-border bg-surface/30 hover:border-border-soft"
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="text-accent">{scenario.icon}</div>
                <h3 className="font-semibold text-foreground text-sm leading-tight">
                  {scenario.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Scenario Details */}
        <AnimatePresence mode="wait">
          {expandedScenario !== null && (
            <motion.div
              key={expandedScenario}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Problem */}
              <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
                <h3 className="font-semibold text-foreground mb-2">The Problem</h3>
                <p className="text-secondary">
                  {scenarios[expandedScenario].problem}
                </p>
              </div>

              {/* DSO Response */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">How DSO Responds</h3>
                <div className="space-y-2">
                  {scenarios[expandedScenario].dsoResponse.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 p-4 rounded-lg border border-border bg-surface/30"
                    >
                      <span className="text-accent font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-foreground-alt text-sm leading-relaxed">
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-lg border border-green-500/30 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Outcome</h3>
                    <p className="text-secondary text-sm">
                      {scenarios[expandedScenario].outcome}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Principle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-6 rounded-lg border border-accent/30 bg-accent/5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Core Principle</h3>
              <p className="text-secondary text-sm">
                DSO assumes failures will happen. Every scenario is handled with checkpoint-based recovery, automatic rollback, or graceful degradation. No manual intervention required. State always consistent.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
