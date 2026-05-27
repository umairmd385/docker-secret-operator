"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface Capability {
  name: string;
  runtime: boolean;
  providers: boolean;
  security: boolean;
}

export const CapabilityMatrix = () => {
  const capabilities: Capability[] = [
    { name: "Zero Disk Persistence", runtime: true, providers: true, security: true },
    { name: "Health Validation", runtime: true, providers: true, security: false },
    { name: "Automatic Rollback", runtime: true, providers: false, security: false },
    { name: "Atomic Swap", runtime: true, providers: true, security: true },
    { name: "Secret Rotation", runtime: true, providers: true, security: true },
    { name: "Environment Injection", runtime: true, providers: true, security: true },
    { name: "File Injection", runtime: true, providers: true, security: true },
    { name: "Multi-Container Support", runtime: true, providers: true, security: false },
  ];

  const categories = [
    { id: "runtime", name: "Runtime", description: "Core operational features" },
    { id: "providers", name: "Multi-Provider", description: "Works with providers" },
    { id: "security", name: "Security", description: "Built-in security controls" },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Capability Matrix
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Verified features across runtime, providers, and security. All verified in current implementation.
          </p>
        </motion.div>

        {/* Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-foreground font-semibold text-sm">Feature</th>
                {categories.map((cat) => (
                  <th key={cat.id} className="text-center py-3 px-4 text-foreground font-semibold text-sm">
                    {cat.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((cap, idx) => (
                <motion.tr
                  key={cap.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
                >
                  <td className="py-3 px-4 text-foreground text-sm font-medium">{cap.name}</td>
                  <td className="py-3 px-4 text-center">
                    {cap.runtime ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cap.providers ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cap.security ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Legend */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg border border-gray-800 bg-gray-900/30"
            >
              <h4 className="font-semibold text-foreground text-sm mb-1">{cat.name}</h4>
              <p className="text-xs text-gray-400">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
