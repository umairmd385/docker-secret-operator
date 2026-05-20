"use client";

import React from "react";
import { motion } from "framer-motion";
import { SecurityBoundaries } from "@/components/diagrams/SecurityBoundaries";
import { RefreshCw, HeartPulse, RotateCcw, ShieldCheck } from "lucide-react";

const guarantees = [
  {
    icon: RefreshCw,
    title: "Atomic Swap",
    category: "Atomic Updates",
    desc: "Container swap is all-or-nothing. No partial states, no traffic split, no inconsistency.",
  },
  {
    icon: HeartPulse,
    title: "Health-Checked",
    category: "Health & Safety",
    desc: "New container must pass health checks before traffic switches. Bad containers are never promoted.",
  },
  {
    icon: RotateCcw,
    title: "Auto-Rollback",
    category: "Recovery",
    desc: "If anything fails during rotation, automatic rollback restores the last known-good container instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Crash-Safe",
    category: "Recovery",
    desc: "Agent crashes don't lose state. Rotations resume from write-ahead checkpoint on restart.",
  },
];

export const ProductionSafety = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for Production
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Defense-in-depth security with operational guarantees that keep your app running.
          </p>
        </motion.div>

        {/* Security Architecture Diagram */}
        <SecurityBoundaries variant="detailed" />

        {/* Operational Guarantees — flat 2×2 grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 sm:mt-20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-3 text-center">
            Operational Guarantees
          </h3>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto text-sm sm:text-base">
            Every rotation is atomic, health-checked, and crash-recoverable by default.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {guarantees.map((g, idx) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * idx }}
                  className="flex items-start gap-4 p-5 sm:p-6 rounded-xl border border-gray-800 bg-gray-900/40 hover:border-accent/30 hover:bg-gray-900/60 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-accent/70 mb-1">
                      {g.category}
                    </div>
                    <p className="font-semibold text-foreground mb-1">{g.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{g.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recovery Guarantee banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-2xl border border-accent/20 bg-accent/5"
        >
          <div className="flex items-start gap-4">
            <div className="text-accent font-bold text-2xl flex-shrink-0">⚡</div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Automatic Recovery
              </h4>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Agent crashes? Secrets in flight? DSO detects and recovers automatically. Old rotations are rolled back, containers are cleaned up, and state is validated on restart. Most incidents need zero operator intervention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
