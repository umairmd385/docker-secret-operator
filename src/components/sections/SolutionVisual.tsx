"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export const SolutionVisual = () => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section
      id="solution"
      className="relative py-20 sm:py-32 bg-background border-t border-gray-800"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Problem: Manual Secret Rotation
          </h2>
          <p className="text-gray-400 text-lg">
            See what happens without automation, versus with DSO
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-4 px-6 py-3 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
          >
            <span className={`font-semibold ${!showSolution ? "text-red-400" : "text-gray-400"}`}>
              Without DSO
            </span>
            <div className="w-12 h-6 rounded-full bg-gray-700 relative">
              <motion.div
                className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                animate={{ left: showSolution ? "26px" : "2px" }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className={`font-semibold ${showSolution ? "text-green-400" : "text-gray-400"}`}>
              With DSO
            </span>
          </motion.button>
        </div>

        {/* Timeline Comparison */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl border transition-all ${
              !showSolution
                ? "border-red-500/30 bg-red-500/5"
                : "border-gray-700 bg-gray-900/30 opacity-50"
            }`}
          >
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
              <X className="w-5 h-5 text-red-400" />
              Without DSO (Status Quo)
            </h3>

            <div className="space-y-6">
              {[
                { time: "0s", label: "Secret expires in provider", status: "change" },
                { time: "1-2s", label: "App tries to use expired secret", status: "error" },
                { time: "5-10s", label: "Authentication fails", status: "error" },
                { time: "~15s", label: "Container crashes", status: "error" },
                { time: "15-20s", label: "Alert fires (incident starts)", status: "alert" },
                { time: "20-30m", label: "On-call wakes up, pages alert", status: "wait" },
                { time: "30-40m", label: "Manual rollback / restart deployed", status: "ok" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-sm font-mono text-gray-500 w-12 shrink-0">
                    {step.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{step.label}</p>
                    {step.status === "error" && (
                      <p className="text-xs text-red-400 mt-1">🔴 DOWN</p>
                    )}
                    {step.status === "alert" && (
                      <p className="text-xs text-yellow-400 mt-1">⚠️ INCIDENT</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`p-8 rounded-2xl border transition-all ${
              showSolution
                ? "border-green-500/30 bg-green-500/5"
                : "border-gray-700 bg-gray-900/30 opacity-50"
            }`}
          >
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              With DSO
            </h3>

            <div className="space-y-6">
              {[
                { time: "0s", label: "Secret expires in provider", status: "change" },
                { time: "~1s", label: "DSO detects change automatically", status: "ok" },
                { time: "~2s", label: "New container spawned (green)", status: "ok" },
                { time: "~3s", label: "Health checks pass", status: "ok" },
                { time: "~4s", label: "Traffic swaps atomically", status: "ok" },
                { time: "~5s", label: "Old container stops", status: "ok" },
                { time: "~5s", label: "✓ Done. Zero downtime.", status: "success" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-sm font-mono text-gray-500 w-12 shrink-0">
                    {step.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{step.label}</p>
                    {step.status === "ok" && (
                      <p className="text-xs text-green-400 mt-1">✓ UP</p>
                    )}
                    {step.status === "success" && (
                      <p className="text-xs text-emerald-400 mt-1 font-semibold">
                        🟢 ZERO DOWNTIME
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Key Takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 p-8 rounded-2xl border border-accent/20 bg-accent/5 text-center"
        >
          <p className="text-2xl font-bold text-foreground mb-2">
            5 seconds vs 20 minutes
          </p>
          <p className="text-gray-400">
            That's the difference between "rotation" and "incident"
          </p>
        </motion.div>
      </div>
    </section>
  );
};
