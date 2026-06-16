"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const FailureScenarios = () => {
  const [activeScenario, setActiveScenario] = useState<number | null>(0);

  const scenarios = [
    {
      title: "Provider Timeout",
      problem: "Secret provider is slow or temporarily unavailable",
      dsoResponse: [
        "Automatic retry with exponential backoff",
        "Old secret stays active (no interruption)",
        "Alerts sent to monitoring system",
        "Next rotation attempted on schedule",
        "Result: Service continues, user unaware",
      ],
      outcome: "Zero downtime, graceful degradation",
    },
    {
      title: "Health Check Failure",
      problem: "New container fails to pass health checks",
      dsoResponse: [
        "Checkpoint marks container unhealthy",
        "Old container remains active serving traffic",
        "New container is terminated cleanly",
        "No swap occurs (safety guarantee)",
        "Retry on next scheduled rotation",
      ],
      outcome: "No downtime, automatic rollback",
    },
    {
      title: "Container Startup Failure",
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
            <H2>What Happens When Things Break</H2>
          </div>
          <PLead className="text-tertiary">
            Failures are expected. DSO is designed to handle them gracefully.
          </PLead>
        </motion.div>

        {/* Scenario Selector */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {scenarios.map((scenario, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveScenario(activeScenario === idx ? null : idx)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                activeScenario === idx
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-border bg-surface/30 hover:border-border-soft"
              }`}
            >
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {scenario.title}
              </h3>
            </motion.button>
          ))}
        </div>

        {/* Scenario Details */}
        <AnimatePresence mode="wait">
          {activeScenario !== null && (
            <motion.div
              key={activeScenario}
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
                  {scenarios[activeScenario].problem}
                </p>
              </div>

              {/* DSO Response */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">How DSO Responds</h3>
                <div className="space-y-2">
                  {scenarios[activeScenario].dsoResponse.map((step, idx) => (
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
                      <p className="text-foreground-alt text-sm leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="p-6 rounded-lg border border-green-500/30 bg-green-500/5 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Outcome</h3>
                  <p className="text-foreground-alt">
                    {scenarios[activeScenario].outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-8 rounded-lg border border-accent/20 bg-accent/5 text-center"
        >
          <p className="text-foreground-alt leading-relaxed">
            <span className="font-semibold text-foreground">Core principle:</span> DSO assumes failures will happen. Every scenario is handled with automatic recovery and zero downtime guarantees. No manual intervention required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
