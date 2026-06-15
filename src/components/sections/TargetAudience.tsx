"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export const TargetAudience = () => {
  const forDSO = [
    "Docker Compose teams",
    "Standalone Docker hosts",
    "Small to medium production environments",
    "Teams wanting automated secret rotation",
    "Docker-native workflows",
    "Simple infrastructure without orchestrators",
  ];

  const notForDSO = [
    "Kubernetes clusters",
    "Docker Swarm",
    "Multi-host distributed systems",
    "Enterprise secret management",
    "Complex audit requirements",
    "Multi-cloud secret synchronization",
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
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Is DSO Right for You?
          </h2>
          <p className="text-lg text-gray-400">
            DSO is purpose-built for Docker teams. Clarity on fit prevents disappointment.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* DSO IS FOR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-lg border border-green-500/30 bg-green-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <h3 className="text-xl font-bold text-foreground">DSO is for:</h3>
            </div>

            <ul className="space-y-3">
              {forDSO.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-green-400 font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* DSO IS NOT FOR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 rounded-lg border border-gray-700 bg-gray-900/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <h3 className="text-xl font-bold text-foreground">DSO is NOT for:</h3>
            </div>

            <ul className="space-y-3">
              {notForDSO.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 text-gray-400"
                >
                  <span className="text-gray-600 font-bold flex-shrink-0 mt-0.5">
                    ✗
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-6 rounded-lg border border-accent/20 bg-accent/5 text-center"
        >
          <p className="text-gray-300">
            <span className="font-semibold text-foreground">If you're unsure:</span> Try DSO on a non-critical service first. The documentation and community can help determine if it's the right fit.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
