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
      method: "DSO V3.1",
      security: "Highest",
      securityColor: "text-accent",
      persistence: "Zero (tmpfs limits)",
      persistenceIcon: <Shield className="w-4 h-4 mr-2" />,
      dynamic: "Yes (Event Driven)",
      icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
      highlight: true
    }
  ];

  return (
    <section id="why" className="py-24 bg-surface2/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Why Not .env or Docker Secrets?
          </h2>
          <p className="text-sm font-mono text-accent/70 tracking-wide mb-4">
            Most secret management tools store secrets. DSO doesn&apos;t.
          </p>
          <p className="text-gray-400 text-lg">
            Most secret management approaches either store secrets on disk or require heavy infrastructure. DSO eliminates both.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-2xl border border-border/50 bg-[#0a0f16] shadow-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-border/50 text-[11px] uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Approach</th>
                <th className="px-6 py-4 font-bold">Security Posture</th>
                <th className="px-6 py-4 font-bold">Persistence</th>
                <th className="px-6 py-4 font-bold">Dynamic Rotation</th>
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
                  className={row.highlight ? "bg-accent/5 relative" : "hover:bg-surface/50 transition-colors"}
                >
                  {row.highlight && (
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></td>
                  )}
                  <td className="p-6 font-bold text-foreground flex items-center gap-3">
                    {row.icon}
                    {row.method}
                  </td>
                  <td className={`p-6 font-mono text-sm ${row.securityColor}`}>
                    {row.security}
                  </td>
                  <td className="p-6 text-sm text-gray-300">
                    <div className="flex items-center">
                      {row.persistenceIcon}
                      {row.persistence}
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-300 flex items-center gap-2">
                    {row.method === "DSO V3.1" ? <Zap className="w-4 h-4 text-accent" /> : null}
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
