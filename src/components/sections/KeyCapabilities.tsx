"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, RefreshCw, Puzzle, Container, FileCheck } from "lucide-react";

const CAPS = [
  {
    icon: Zap,
    title: "Runtime Injection",
    desc: "Secrets injected at container start — never baked into images or configs.",
    accent: false,
  },
  {
    icon: Shield,
    title: "Zero Persistence",
    desc: "Nothing written to disk. Secrets exist only in container memory at runtime.",
    accent: true,
  },
  {
    icon: RefreshCw,
    title: "Automatic Rotation",
    desc: "Detect, rotate, and verify — completely hands-free. Rollback on failure.",
    accent: false,
  },
  {
    icon: Puzzle,
    title: "Provider Plugins",
    desc: "Swap providers without changing application code. AWS, Vault, Azure, Huawei.",
    accent: false,
  },
  {
    icon: Container,
    title: "Docker Native",
    desc: "Built for Docker Compose. No Kubernetes, no cloud lock-in, no agents.",
    accent: true,
  },
  {
    icon: FileCheck,
    title: "Audit Ready",
    desc: "Complete rotation audit trail. Every event logged, timestamped, traceable.",
    accent: false,
  },
];

export const KeyCapabilities = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "#94A3B8" }}
          >
            Capabilities
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            What DSO delivers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
                style={{
                  background: cap.accent
                    ? "rgba(0,230,192,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: cap.accent
                    ? "1px solid rgba(0,230,192,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(0,230,192,0.35)";
                  el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = cap.accent
                    ? "rgba(0,230,192,0.2)"
                    : "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(0,230,192,0.1)",
                    border: "1px solid rgba(0,230,192,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "#F8FAFC" }}
                >
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  {cap.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
