"use client";

import React from "react";
import { motion } from "framer-motion";

const METRICS = [
  { value: "Zero", label: "Downtime", teal: true },
  { value: "5", label: "Secret Providers", teal: false },
  { value: "0 bytes", label: "Disk Writes", teal: true },
  { value: "Auto", label: "Rotation", teal: false },
  { value: "~50 MB", label: "Memory Footprint", teal: true },
];

export const MetricsStrip = () => {
  return (
    <section
      className="relative border-y"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,230,192,0.03), transparent 30%, transparent 70%, rgba(109,93,246,0.03))",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {METRICS.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="px-6 py-8 text-center"
              style={{
                borderRight:
                  idx < METRICS.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : undefined,
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1"
                style={{
                  color: m.teal ? "#00E6C0" : "#F8FAFC",
                  textShadow: m.teal
                    ? "0 0 24px rgba(0,230,192,0.2)"
                    : undefined,
                }}
              >
                {m.value}
              </div>
              <div
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "#94A3B8" }}
              >
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
