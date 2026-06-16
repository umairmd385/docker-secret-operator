"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Users, Zap } from "lucide-react";
import { H2, PLead, P, PSmall } from "@/components/ui/Typography";

export const ProblemSection = () => {
  const steps = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Secret Changes",
      description: "Password rotated in your provider",
      time: "T+0s",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Manual Restart",
      description: "Team manually restarts containers",
      time: "T+5m",
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Connections Drop",
      description: "Active requests fail. Customers see errors.",
      time: "T+7m",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "On-Call Panic",
      description: "Incident channel lights up. Pages go out.",
      time: "T+10m",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <H2 className="mb-6">Secret rotation shouldn't bring production down.</H2>
          <PLead className="text-gray-400">
            Yet today, most teams face a choice: rotate secrets and accept downtime, or skip rotation and accept risk.
          </PLead>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="flex gap-6 p-6 rounded-lg border border-gray-800/50 bg-gray-900/30 transition-all duration-300 hover:bg-gray-900/50 hover:border-red-500/30"
              >
                {/* Timeline connector */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                    {step.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-red-500/30 to-red-500/10" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {step.title}
                      </h3>
                      <PSmall className="text-gray-400">{step.description}</PSmall>
                    </div>
                    <div className="text-xs font-mono text-red-400 flex-shrink-0">
                      {step.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 rounded-lg border border-red-500/20 bg-red-500/5"
          >
            <P className="text-gray-300">
              <span className="font-semibold text-foreground">The result:</span> Downtime. Failed requests. Customer impact. Engineer burnout.
            </P>
            <PSmall className="text-gray-400 mt-3">
              Most teams solve this by skipping rotation altogether. That's worse—secrets stay the same for months.
            </PSmall>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
