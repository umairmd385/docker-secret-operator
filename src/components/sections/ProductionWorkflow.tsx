"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Lock, CheckCircle2, AlertCircle, RotateCcw, Shield, Eye, Zap } from "lucide-react";

type WorkflowStage = "detect" | "lock" | "create" | "validate" | "swap" | "cleanup" | "recovery";

const workflowStages: { id: WorkflowStage; title: string; description: string; icon: any; details: string[] }[] = [
  {
    id: "detect",
    title: "Detect Secret Change",
    description: "Event trigger detects secret change in backend",
    icon: Eye,
    details: [
      "Source: Vault webhook / polling / custom trigger",
      "Verify: Secret actually changed (not spurious event)",
      "State: rotation.pending",
      "Time: < 5 seconds from change to detection"
    ]
  },
  {
    id: "lock",
    title: "Acquire Lock",
    description: "Get exclusive operation lock to prevent concurrent rotations",
    icon: Lock,
    details: [
      "Lock file: ~/.dso/state/lock",
      "Validate: Check stale locks (age > 30 min)",
      "Prevent: Multi-agent concurrent operation",
      "Fail: If lock held, queue and retry"
    ]
  },
  {
    id: "create",
    title: "Create New Container",
    description: "Create new container with updated secret, old container still serving traffic",
    icon: Zap,
    details: [
      "Image: Same as running container",
      "Secret: Injected from new secret value",
      "Status: Not receiving traffic yet",
      "Health: Waiting for validation",
      "Fail Path: On creation failure, cleanup and retry"
    ]
  },
  {
    id: "validate",
    title: "Validate Health",
    description: "Run health checks on new container before traffic switch (CRITICAL)",
    icon: CheckCircle2,
    details: [
      "Check: /healthz or custom endpoint",
      "Timeout: Configurable (default 30s)",
      "Retry: Exponential backoff on failure",
      "Decision Point: Health result determines next action",
      "✓ PASS → Proceed to swap",
      "❌ FAIL → Auto-rollback (next stage)"
    ]
  },
  {
    id: "swap",
    title: "Atomic Container Swap",
    description: "Rename containers atomically. Zero-downtime transition.",
    icon: RotateCcw,
    details: [
      "Old: postgres → postgres.old",
      "New: postgres-new → postgres",
      "Traffic: Now routed to new container",
      "Downtime: 0 seconds (atomic operation)",
      "Rollback: If swap fails, can revert names"
    ]
  },
  {
    id: "cleanup",
    title: "Stop Old Container",
    description: "Remove old container. Complete rotation.",
    icon: Shield,
    details: [
      "Remove: Old container (postgres.old)",
      "Logs: Preserved for debugging",
      "State: Mark rotation as complete",
      "Duration: ~7-10 seconds total"
    ]
  },
  {
    id: "recovery",
    title: "Crash Recovery",
    description: "If agent crashes, automatic recovery on restart",
    icon: AlertCircle,
    details: [
      "Detect: In-progress rotation in state file",
      "Age Check: How long has been in-progress?",
      "If < 5 min: Resume from checkpoint",
      "If > 5 min: Auto-rollback (assume timeout)",
      "Cleanup: Stop orphaned containers",
      "Result: System returns to known-good state"
    ]
  }
];

export const ProductionWorkflow = () => {
  const [expandedStage, setExpandedStage] = useState<WorkflowStage | null>("detect");

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-background via-blue-500/2 to-surface2/20 border-t border-b border-blue-500/15 overflow-hidden">
      {/* Telemetry blue atmosphere for operational workflow context */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/8 via-transparent to-transparent rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[400px] bg-gradient-to-l from-blue-500/5 to-transparent rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Complete Rotation Workflow
          </h2>
          <p className="text-xs sm:text-sm font-mono text-accent/70 tracking-wide mb-6">
            ◆ HOW IT WORKS ◆
          </p>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Every step of the process, from detection to recovery. Built for production safety with automatic rollback and crash recovery.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-2 sm:space-y-3">
          {workflowStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isExpanded = expandedStage === stage.id;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
              >
                <button
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                  className={`w-full text-left p-4 sm:p-6 rounded-lg sm:rounded-xl border transition-all ${
                    isExpanded
                      ? "border-accent/30 bg-accent/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white truncate">{stage.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{stage.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 ml-6 sm:ml-8 pl-4 sm:pl-6 border-l-2 border-accent/30"
                  >
                    <div className="py-4 space-y-2 sm:space-y-3">
                      {stage.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400"
                        >
                          <span className="text-accent font-bold mt-1">•</span>
                          <span>{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Connector to next stage */}
                {idx < workflowStages.length - 1 && (
                  <div className="relative h-2 sm:h-3 flex items-center justify-center">
                    <div className="h-full border-l border-accent/20 ml-5 sm:ml-6" />
                    <div className="absolute text-[8px] sm:text-[10px] bg-background px-2 text-accent/50 font-mono">
                      ↓
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Key Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl border border-accent/20 bg-accent/5"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Key Workflow Guarantees</h3>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <p className="text-accent font-semibold text-sm">Atomicity</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Container swap is atomic. Either fully switches or fully reverts. No partial states.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-accent font-semibold text-sm">Health-Driven</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Health validation mandatory. New container must be healthy before traffic switch.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-accent font-semibold text-sm">Lock Protected</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Exclusive lock prevents concurrent operations. Only one rotation at a time.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-accent font-semibold text-sm">Recoverable</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                State persisted. Agent crash → automatic recovery on restart. No data loss.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
