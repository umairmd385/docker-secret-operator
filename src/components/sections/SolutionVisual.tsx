"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export const SolutionVisual = () => {
  const withoutDSO = [
    "Update secret in provider",
    "Restart containers manually",
    "Traffic interruption occurs",
    "Manual recovery required",
  ];

  const withDSO = [
    "DSO detects change",
    "Spawns healthy container",
    "Swaps traffic atomically",
    "Automatic rollback on failure",
  ];

  const ComparisonItem = ({
    icon: Icon,
    label,
    color
  }: {
    icon: any;
    label: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-start gap-3"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${color}`} />
      <span className="text-sm text-foreground">{label}</span>
    </motion.div>
  );

  return (
    <section className="relative py-20 sm:py-24 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Minimal header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Why DSO Exists
          </h2>
          <p className="text-gray-400 text-sm">
            Manual secret rotation vs. automated rotation
          </p>
        </motion.div>

        {/* Compact side-by-side comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Without DSO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border border-red-500/20 bg-red-500/5"
          >
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <X className="w-4 h-4 text-red-400" />
              Without DSO
            </h3>
            <div className="space-y-3">
              {withoutDSO.map((item, idx) => (
                <ComparisonItem
                  key={idx}
                  icon={X}
                  label={item}
                  color="text-red-400/60"
                />
              ))}
            </div>
          </motion.div>

          {/* With DSO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-lg border border-green-500/20 bg-green-500/5"
          >
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              With DSO
            </h3>
            <div className="space-y-3">
              {withDSO.map((item, idx) => (
                <ComparisonItem
                  key={idx}
                  icon={CheckCircle2}
                  label={item}
                  color="text-green-400"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
