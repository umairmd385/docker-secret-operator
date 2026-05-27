"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Package, HeartPulse, RefreshCw, Trash2, RotateCcw, ChevronDown } from "lucide-react";

interface LifecycleStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const steps: LifecycleStep[] = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Detect Change",
    description: "Watcher polls provider or receives webhook. ~1s.",
    delay: 0,
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: "Spawn Container",
    description: "Launch new container with updated secrets in memory.",
    delay: 0.1,
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    title: "Validate Health",
    description: "Wait for health checks to pass (default 30s timeout).",
    delay: 0.2,
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Swap Traffic",
    description: "Atomically rename containers. Old → backup, new → active.",
    delay: 0.3,
  },
  {
    icon: <Trash2 className="w-5 h-5" />,
    title: "Cleanup",
    description: "Stop and remove old container. Secrets cleared from memory.",
    delay: 0.4,
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: "Rollback",
    description: "On failure: restore previous container automatically.",
    delay: 0.5,
  },
];

export const RotationLifecycle = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Rotation Runtime
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            What you experience: DSO detects changes and rotates containers automatically, without downtime. Each step is validated before the next begins.
          </p>
        </motion.div>

        {/* Desktop: Timeline */}
        <div className="hidden md:block">
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                className="relative"
              >
                {/* Step Card */}
                <div className="flex items-start gap-6 py-6 px-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 transition-colors group">
                  {/* Step Number */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 group-hover:border-accent/50 group-hover:bg-accent/20 transition-all">
                    <div className="text-accent font-mono font-bold text-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-accent">{step.icon}</div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow to next step */}
                  {idx < steps.length - 1 && (
                    <div className="flex-shrink-0 text-gray-700">
                      <ChevronDown className="w-5 h-5 rotate-90" />
                    </div>
                  )}
                </div>

                {/* Vertical Connector Line */}
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay + 0.2 }}
                    className="h-4 ml-6 border-l border-gradient border-gray-700"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="md:hidden space-y-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
              className="p-4 rounded-lg border border-gray-800 bg-gray-900/30"
            >
              <div className="flex items-start gap-3">
                {/* Step Number */}
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="text-accent font-mono font-bold text-xs">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-accent text-sm">{step.icon}</div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow indicator for mobile */}
              {idx < steps.length - 1 && (
                <div className="mt-2 ml-10 text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
