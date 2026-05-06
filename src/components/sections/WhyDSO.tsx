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
    <section id="why" className="py-12 sm:py-20 md:py-24 bg-surface2/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Why Not .env or Docker Secrets?
          </h2>
          <p className="text-xs sm:text-sm font-mono text-accent/70 tracking-wide mb-4">
            Securing the entire secret lifecycle.
          </p>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Traditional approaches either leak secrets via disk or require complex infrastructure. DSO provides a unified, secure workflow for both local development and production.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-2xl border border-border/50 bg-[#0a0f16] shadow-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-border/50 text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-500">
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Approach</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Security Posture</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Persistence</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold">Dynamic Rotation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {comparisons.map((row, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={row.highlight ? "bg-accent/[0.07] relative border-y border-accent/20 shadow-[inset_0_0_20px_rgba(0,230,192,0.05)]" : "hover:bg-surface/50 transition-colors"}
                >
                  {row.highlight && (
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></td>
                  )}
                  <td className={`p-3 sm:p-6 font-bold text-xs sm:text-sm text-foreground flex items-center gap-2 sm:gap-3 ${row.highlight ? 'text-accent' : ''}`}>
                    {row.icon}
                    {row.method}
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
