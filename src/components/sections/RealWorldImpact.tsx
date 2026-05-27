"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Database, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface ImpactStep {
  time: string;
  event: string;
  icon: React.ReactNode;
  color: string;
}

export const RealWorldImpact = () => {
  const timeline: ImpactStep[] = [
    {
      time: "1",
      event: "Database password expires or rotates",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-yellow-400",
    },
    {
      time: "2",
      event: "DSO detects change in secret provider",
      icon: <RefreshCw className="w-5 h-5" />,
      color: "text-blue-400",
    },
    {
      time: "3",
      event: "New container spawned with updated credentials",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      time: "4",
      event: "Health checks validate container readiness",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      time: "5",
      event: "Traffic swapped atomically to new container",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      time: "6",
      event: "Old container cleaned up. Rotation complete.",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <Database className="w-6 h-6 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Real-World Example
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-400">
            Your database password expires at midnight. Here's what happens automatically.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {timeline.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4"
            >
              {/* Time Badge */}
              <div className="flex-shrink-0 w-16 text-right">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-accent/10 border border-accent/30">
                  <span className="text-xs font-mono font-bold text-accent">{step.time}</span>
                </div>
              </div>

              {/* Icon & Connector */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center ${step.color}`}>
                  {step.icon}
                </div>
                {idx < timeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-gradient-to-b from-accent/30 to-accent/5 my-2" />
                )}
              </div>

              {/* Event Description */}
              <div className="flex-1 pt-1">
                <p className="text-sm sm:text-base text-gray-300 font-medium">{step.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Outcome Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-lg border border-green-500/30 bg-green-500/5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">Result: Automatic and Safe</h3>
          </div>
          <p className="text-sm text-gray-400">
            Database credentials rotated. Containers updated with new secrets. No downtime. No manual intervention needed. Automatic rollback if validation fails.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
