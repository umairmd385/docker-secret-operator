"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, RotateCw, CheckCircle2, ChevronRight } from "lucide-react";
import { RotationFlow } from "@/components/diagrams/RotationFlow";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Eye,
      number: "1",
      title: "Detects Change",
      description: "Watches for secret updates from Vault, AWS, Azure, etc.",
    },
    {
      icon: RotateCw,
      number: "2",
      title: "Rotates Safely",
      description: "Creates new container, validates health, swaps traffic atomically.",
    },
    {
      icon: CheckCircle2,
      number: "3",
      title: "Recovers Automatically",
      description: "If anything fails, rolls back automatically. Your app stays up.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps. Zero code changes. Zero downtime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Connection line (hidden on last) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex items-center absolute top-8 -right-4 w-8 h-px pointer-events-none">
                    <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
                    <ChevronRight className="w-4 h-4 text-accent/30 -ml-2" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="mb-6 w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Step Number */}
                  <div className="text-sm font-mono text-accent mb-3">
                    Step {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl border border-gray-800 bg-gray-900/30 text-center"
        >
          <p className="text-lg font-semibold text-foreground">
            Atomic. Health-Checked. Recoverable.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Every rotation is all-or-nothing. New container must be healthy. If it fails, we roll back automatically.
          </p>
        </motion.div>

        {/* Detailed Rotation Flow */}
        <div className="mt-20">
          <RotationFlow variant="detailed" showAnimation={true} />
        </div>
      </div>
    </section>
  );
};
