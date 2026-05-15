"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FailureScenario {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const failures: FailureScenario[] = [
  {
    title: "Stale Secrets Circulate",
    description: "Secrets expire, containers restart with old values, auth fails silently across your stack.",
  },
  {
    title: "Rollback Fails Silently",
    description: "New secret invalid → container unhealthy → no automatic recovery → manual operator intervention required.",
  },
  {
    title: "Runtime State Inconsistency",
    description: "Some containers updated, some stale, system incoherent. Debugging becomes a nightmare.",
  },
  {
    title: "Manual Operator Intervention",
    description: "On-call forced to manually recover during incidents. No automatic detection, no predictable recovery.",
  },
];

export const SecretRotationFailures = () => {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background via-red-950/3 to-background border-t border-border/30">
      {/* Subtle grid background with alert red */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(239, 68, 68, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(239, 68, 68, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Atmospheric red glow for failure context */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-red-600/20 via-transparent to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-[10px] sm:text-xs font-mono text-red-500/70 tracking-widest uppercase mb-4 sm:mb-6">
            ◆ WHEN ROTATION FAILS ◆
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Why Secret Rotation Fails <br />
            <span className="text-red-400">in Production</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Real operational pain. Real consequences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {failures.map((failure, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-500/8 to-red-600/5 p-8 hover:from-red-500/12 hover:to-red-600/10 hover:border-red-500/40 transition-all duration-300"
            >
              {/* Semantic failure glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-transparent to-red-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              {/* Telemetry blue accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-transparent" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br from-red-500/15 to-red-600/10 border border-red-500/30 group-hover:from-red-500/25 group-hover:to-red-600/20 transition-colors shadow-lg shadow-red-500/10 group-hover:shadow-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight flex-1">
                    {failure.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {failure.description}
                </p>

                <div className="mt-6 pt-6 border-t border-gradient-to-r from-red-500/10 via-transparent to-transparent">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 shadow-lg shadow-red-500/50" />
                    <span className="text-red-300/80">Incident severity:</span>
                    <span className="text-red-400 font-semibold">Critical</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center p-8 sm:p-12 rounded-2xl border border-amber-500/20 bg-amber-500/5"
        >
          <p className="text-lg font-semibold text-foreground mb-2">
            This is where most platforms stop.
          </p>
          <p className="text-gray-400">
            They manage rotations, but ignore what happens when things break.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-lg text-accent font-semibold">
            DSO starts where others stop: <span className="font-bold text-white">automatic recovery.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
