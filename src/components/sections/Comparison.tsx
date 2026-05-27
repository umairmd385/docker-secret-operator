"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  env: boolean;
  dockerSecrets: boolean;
  dso: boolean;
}

export const Comparison = () => {
  const features: ComparisonFeature[] = [
    {
      feature: "Zero-Downtime Rotation",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Automatic Rollback",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Health Validation",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Crash Recovery",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Provider Sync",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Encrypted Local Vault",
      env: false,
      dockerSecrets: false,
      dso: true,
    },
    {
      feature: "Container Runtime Injection",
      env: true,
      dockerSecrets: true,
      dso: true,
    },
    {
      feature: "Environment Variable Support",
      env: true,
      dockerSecrets: true,
      dso: true,
    },
  ];

  const FeatureCell = ({ value }: { value: boolean }) => (
    <div className="flex justify-center">
      {value ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <X className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );

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
            How DSO Compares
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            .env files, Docker Secrets, and DSO serve different needs. DSO adds automated rotation, recovery, and validation without downtime.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/30"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left p-4 sm:p-6 font-semibold text-foreground">
                  Feature
                </th>
                <th className="text-center p-4 sm:p-6 font-semibold text-foreground">
                  .env Files
                </th>
                <th className="text-center p-4 sm:p-6 font-semibold text-foreground">
                  Docker Secrets
                </th>
                <th className="text-center p-4 sm:p-6 font-semibold text-foreground">
                  DSO
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, idx) => (
                <motion.tr
                  key={item.feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-800 hover:bg-gray-900/20 transition-colors"
                >
                  <td className="text-left p-4 sm:p-6 text-gray-300 font-medium">
                    {item.feature}
                  </td>
                  <td className="p-4 sm:p-6">
                    <FeatureCell value={item.env} />
                  </td>
                  <td className="p-4 sm:p-6">
                    <FeatureCell value={item.dockerSecrets} />
                  </td>
                  <td className="p-4 sm:p-6">
                    <FeatureCell value={item.dso} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-4 sm:p-5 rounded-lg border border-gray-800 bg-gray-900/30 text-sm text-gray-400"
        >
          <p>
            <span className="font-semibold text-foreground">Note:</span> Docker Secrets
            and .env files work best for static secrets in Swarm or Compose. DSO adds
            automatic rotation, recovery, and health validation for production workloads.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
