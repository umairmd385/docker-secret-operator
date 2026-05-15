"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, HardDrive, Cpu, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const WhyDSO = () => {
  const comparisons = [
    {
      method: ".env Files",
      security: "Low",
      securityColor: "text-red-400",
      persistence: "Disk",
      persistenceIcon: <HardDrive className="w-4 h-4 mr-2" />,
      dynamic: "No (Requires rebuild)",
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    {
      method: "Docker Built-in Secrets",
      security: "Medium",
      securityColor: "text-yellow-400",
      persistence: "Disk (Swarm nodes)",
      persistenceIcon: <HardDrive className="w-4 h-4 mr-2" />,
      dynamic: "No (Requires container replacement)",
      icon: <XCircle className="w-5 h-5 text-yellow-500" />
    },
    {
      method: "Vault agent Sidecars",
      security: "High",
      securityColor: "text-emerald-400",
      persistence: "Memory",
      persistenceIcon: <Cpu className="w-4 h-4 mr-2" />,
      dynamic: "Yes (Heavy CPU/Polling)",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    },
    {
      method: "DSO V3.2 (Dual-Mode)",
      security: "Highest (AES-256)",
      securityColor: "text-accent",
      persistence: "Zero-Leak (tmpfs / enc)",
      persistenceIcon: <Shield className="w-4 h-4 mr-2" />,
      dynamic: "Yes (Local & Cloud)",
      icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
      highlight: true
    }
  ];

  return (
    <section id="why" className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-background via-blue-500/3 to-background border-t border-b border-border/30 overflow-hidden">
      {/* Telemetry blue atmospheric depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-gradient-to-l from-blue-500/5 to-transparent rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Why Not .env or Docker Secrets?
          </h2>
          <p className="text-xs sm:text-sm font-mono text-accent/70 tracking-wide mb-6">
            ◆ THE SECURITY COMPARISON ◆
          </p>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Traditional approaches either leak secrets via disk or require complex infrastructure. DSO provides a unified, secure workflow for both local development and production.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-[#0a0f16] shadow-2xl shadow-blue-500/10">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-surface to-blue-500/5 border-b border-blue-500/20 text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400">
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Approach</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Security Posture</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Persistence</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Dynamic Rotation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10">
              {comparisons.map((row, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={row.highlight ? "bg-gradient-to-r from-accent/12 via-emerald-500/8 to-accent/5 border-y border-accent/30 shadow-[inset_0_0_30px_rgba(0,229,194,0.08)] hover:shadow-[inset_0_0_40px_rgba(0,229,194,0.12)] transition-all" : "hover:bg-blue-500/5 transition-colors"}
                >
                  <td className={`p-3 sm:p-6 font-bold text-xs sm:text-sm text-foreground ${row.highlight ? 'text-accent border-l-2 border-accent' : ''}`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {row.icon}
                      {row.method}
                    </div>
                  </td>
                  <td className={`p-3 sm:p-6 font-mono text-xs sm:text-sm ${row.securityColor} ${row.highlight ? 'font-bold' : ''}`}>
                    {row.security}
                  </td>
                  <td className={`p-3 sm:p-6 text-xs sm:text-sm text-gray-300 ${row.highlight ? 'font-medium text-gray-100' : ''}`}>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {row.persistenceIcon}
                      {row.persistence}
                    </div>
                  </td>
                  <td className={`p-3 sm:p-6 text-xs sm:text-sm text-gray-300 flex items-center gap-1 sm:gap-2 ${row.highlight ? 'font-medium text-accent' : ''}`}>
                    {row.method.includes("DSO") ? <Zap className="w-4 h-4 text-accent" /> : null}
                    {row.dynamic}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
