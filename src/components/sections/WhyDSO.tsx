"use client";

import React from "react";
import { motion } from "framer-motion";

const ROWS = [
  {
    category: "Setup",
    dso: "5 minutes",
    manual: "Hours of scripting",
    vault: "Days of infra setup",
    infisical: "1–2 hours",
  },
  {
    category: "Rotation ops",
    dso: "Fully automated",
    manual: "Manual restarts",
    vault: "DevOps required",
    infisical: "Platform managed",
  },
  {
    category: "Downtime",
    dso: "Zero",
    manual: "30s+ per rotation",
    vault: "Policy-dependent",
    infisical: "Integration-dependent",
  },
  {
    category: "Infrastructure",
    dso: "Lightweight Docker agent",
    manual: "Script runner / cron",
    vault: "Separate Vault server",
    infisical: "Cloud platform",
  },
  {
    category: "Failure recovery",
    dso: "Automatic (checkpoint)",
    manual: "Manual investigation",
    vault: "Ops intervention",
    infisical: "Platform reliability",
  },
  {
    category: "Learning curve",
    dso: "Minimal (Docker users)",
    manual: "Custom per team",
    vault: "Days (complex)",
    infisical: "Hours (web UI)",
  },
  {
    category: "Cost",
    dso: "Free / open source",
    manual: "Dev time",
    vault: "Free or $$$$",
    infisical: "Free or $$$",
  },
];

export const WhyDSO = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "#94A3B8" }}
          >
            Comparison
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4"
            style={{ color: "#F8FAFC" }}
          >
            DSO vs. alternatives
          </h2>
          <p className="text-lg" style={{ color: "#94A3B8" }}>
            Lightweight rotation. Not a secret manager. Know the tradeoffs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-xl"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Category
                </th>
                <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#00E6C0" }}>
                  DSO
                </th>
                <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Manual Scripts
                </th>
                <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  HashiCorp Vault
                </th>
                <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Infisical
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                    background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  }}
                >
                  <td className="py-3.5 px-5 font-medium" style={{ color: "#F8FAFC" }}>
                    {row.category}
                  </td>
                  <td className="py-3.5 px-5 font-medium" style={{ color: "#00E6C0" }}>
                    {row.dso}
                  </td>
                  <td className="py-3.5 px-5" style={{ color: "#94A3B8" }}>
                    {row.manual}
                  </td>
                  <td className="py-3.5 px-5" style={{ color: "#94A3B8" }}>
                    {row.vault}
                  </td>
                  <td className="py-3.5 px-5" style={{ color: "#94A3B8" }}>
                    {row.infisical}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-6 rounded-xl text-sm"
          style={{
            background: "rgba(0,230,192,0.04)",
            border: "1px solid rgba(0,230,192,0.15)",
            color: "#94A3B8",
            lineHeight: "1.7",
          }}
        >
          <span style={{ color: "#F8FAFC", fontWeight: 600 }}>Bottom line: </span>
          DSO is the right tool for Docker Compose teams that want zero-downtime secret rotation without ops overhead. It is not a secret manager replacement. If you run Kubernetes, need team-based access controls, or require a full secret management platform, use a purpose-built solution.
        </motion.div>
      </div>
    </section>
  );
};
