"use client";

import React from "react";
import { motion } from "framer-motion";
import { H2, PLead } from "@/components/ui/Typography";

export const WhyDSO = () => {
  const comparisons = [
    {
      category: "Setup Time",
      dso: "5 minutes",
      manual: "Hours of script development",
      vault: "Days of infrastructure setup",
      infisical: "1-2 hours with UI learning curve",
    },
    {
      category: "Operational Burden",
      dso: "Zero - fully automated",
      manual: "High - manual restarts required",
      vault: "Medium - requires DevOps expertise",
      infisical: "Medium - requires platform management",
    },
    {
      category: "Downtime Risk",
      dso: "Zero with DSO",
      manual: "30+ seconds per rotation",
      vault: "Depends on rotation policy configuration",
      infisical: "Depends on application integration",
    },
    {
      category: "Infrastructure Overhead",
      dso: "<50MB RAM, <5% CPU",
      manual: "Script runner or cron job",
      vault: "Separate Vault server(s) required",
      infisical: "Cloud platform dependency",
    },
    {
      category: "Failure Recovery",
      dso: "Automatic checkpoint-based",
      manual: "Manual investigation required",
      vault: "Requires ops intervention",
      infisical: "Depends on platform reliability",
    },
    {
      category: "Learning Curve",
      dso: "1 hour - just Docker knowledge",
      manual: "Varies - custom implementation",
      vault: "Days - complex ecosystem",
      infisical: "Hours - web UI based",
    },
    {
      category: "Cost",
      dso: "Free (open source)",
      manual: "Development time investment",
      vault: "Free self-hosted or $$$$ managed",
      infisical: "Free or $$$ per seat",
    },
    {
      category: "Scope",
      dso: "Rotation only - does one thing well",
      manual: "Rotation only - custom implementation",
      vault: "Complete secret management platform",
      infisical: "Secret management + UI + team features",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <H2 className="mb-4">Why DSO Over Alternatives?</H2>
          <PLead className="text-tertiary">
            Honest tradeoffs. DSO is lightweight rotation. Choose based on your needs.
          </PLead>
        </motion.div>

        {/* Comparison Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-lg border border-border"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Outcome
                </th>
                <th className="text-left py-4 px-6 font-semibold text-accent">
                  DSO
                </th>
                <th className="text-left py-4 px-6 font-semibold text-secondary">
                  Manual Scripts
                </th>
                <th className="text-left py-4 px-6 font-semibold text-secondary">
                  Vault
                </th>
                <th className="text-left py-4 px-6 font-semibold text-secondary">
                  Infisical
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-border ${
                    idx % 2 === 0 ? "bg-surface/20" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-foreground text-sm">
                    {row.category}
                  </td>
                  <td className="py-4 px-6 text-accent text-sm font-medium">
                    {row.dso}
                  </td>
                  <td className="py-4 px-6 text-secondary text-sm">
                    {row.manual}
                  </td>
                  <td className="py-4 px-6 text-secondary text-sm">
                    {row.vault}
                  </td>
                  <td className="py-4 px-6 text-secondary text-sm">
                    {row.infisical}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Honest Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-8 rounded-lg border border-accent/20 bg-accent/5"
        >
          <p className="text-foreground-alt leading-relaxed">
            <span className="font-semibold text-foreground">Bottom line:</span> DSO is the simplest solution for Docker Compose teams that want automated zero-downtime secret rotation without operational overhead. It's not a secret manager replacement—it's a rotation tool that integrates with your existing secret management. If you're running Kubernetes, using Vault with rotation policies, or need team-based secret management, those solutions are better fits.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
