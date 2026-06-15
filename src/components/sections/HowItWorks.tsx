"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Lock, Check, Zap, Trash2, Shield } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const HowItWorks = () => {
  const stages = [
    {
      number: "1",
      icon: <Eye className="w-6 h-6" />,
      title: "Detect",
      description: "DSO watches your provider for secret changes",
      color: "blue",
    },
    {
      number: "2",
      icon: <Lock className="w-6 h-6" />,
      title: "Lock",
      description: "Acquire lock to prevent concurrent rotations",
      color: "teal",
    },
    {
      number: "3",
      icon: <Check className="w-6 h-6" />,
      title: "Validate",
      description: "Spawn new container and run health checks",
      color: "teal",
    },
    {
      number: "4",
      icon: <Zap className="w-6 h-6" />,
      title: "Swap",
      description: "Atomic rename at Docker daemon level",
      color: "green",
    },
    {
      number: "5",
      icon: <Trash2 className="w-6 h-6" />,
      title: "Cleanup",
      description: "Stop old container, purge secrets, release lock",
      color: "teal",
    },
  ];

  const colorClasses = {
    blue: "text-blue-400",
    teal: "text-accent",
    green: "text-green-400",
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
          <H2 className="mb-4">The elegance is in the simplicity.</H2>
          <PLead className="text-gray-400">
            Five steps. One outcome: traffic never stops.
          </PLead>
        </motion.div>

        {/* Flow diagram - horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-accent/30 to-green-500/0 transform -translate-y-1/2" />

          {/* Stages grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {stages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center"
              >
                {/* Stage circle */}
                <motion.div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 flex items-center justify-center mb-6 transition-all duration-300 hover:border-accent/50 ${colorClasses[stage.color as keyof typeof colorClasses]}`}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-2xl font-bold">{stage.number}</div>
                </motion.div>

                {/* Icon */}
                <div className={`mb-4 ${colorClasses[stage.color as keyof typeof colorClasses]}`}>
                  {stage.icon}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {stage.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {stage.description}
                </p>

                {/* Mobile connector */}
                {idx < stages.length - 1 && (
                  <div className="lg:hidden my-6 w-1 h-8 bg-gradient-to-b from-accent/30 to-accent/10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto p-6 rounded-lg border border-accent/30 bg-accent/5"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                The atomic swap guarantee
              </h4>
              <p className="text-sm text-gray-400">
                Old container stays running until new one is fully healthy. If anything fails, automatic rollback. Traffic never stops.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
