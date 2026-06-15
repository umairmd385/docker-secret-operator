"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export const WhyDSO = () => {
  const features = [
    "Zero-downtime rotation",
    "Automatic crash recovery",
    "Health validation",
    "Atomic swap guarantee",
    "Checkpoint persistence",
    "Docker native",
    "Open source",
    "No downtime risk",
  ];

  const competitors = {
    dso: {
      name: "DSO",
      description: "Purpose-built for Docker environments",
      checks: [true, true, true, true, true, true, true, true],
    },
    manual: {
      name: "Manual Scripts",
      description: "Custom restart logic",
      checks: [false, false, false, false, false, true, true, false],
    },
    infisical: {
      name: "Infisical",
      description: "General-purpose secret manager",
      checks: [false, false, false, false, false, false, true, false],
    },
  };

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Why choose DSO?
          </h2>
          <p className="text-lg text-gray-400">
            Purpose-built for Docker. Zero-downtime rotation. Crash recovery.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 font-semibold text-foreground">
                  Feature
                </th>
                {Object.entries(competitors).map(([key, comp]) => (
                  <th
                    key={key}
                    className={`text-center py-4 px-4 font-semibold ${
                      key === "dso" ? "text-accent" : "text-gray-400"
                    }`}
                  >
                    <div className="text-sm font-bold">{comp.name}</div>
                    <div className="text-xs text-gray-500 font-normal">
                      {comp.description}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-900/20 transition-colors">
                  <td className="py-4 px-4 text-sm text-foreground font-medium">
                    {feature}
                  </td>
                  {Object.entries(competitors).map(([key, comp]) => (
                    <td
                      key={key}
                      className="py-4 px-4 text-center"
                    >
                      {comp.checks[idx] ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Why DSO wins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          {[
            {
              title: "vs Manual Scripts",
              points: [
                "No manual orchestration",
                "Automatic recovery on crash",
                "Health checks built-in",
                "Audit trail maintained",
              ],
            },
            {
              title: "vs General-Purpose Tools",
              points: [
                "Docker-native design",
                "Zero-downtime guarantee",
                "Lightweight & focused",
                "Production-proven",
              ],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="p-6 rounded-lg border border-gray-800 bg-gray-900/30"
            >
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
