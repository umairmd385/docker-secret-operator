"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Zap, HardDrive } from "lucide-react";

const painPoints = [
  { icon: XCircle, text: "Secrets leaked via .env files in git history" },
  { icon: AlertTriangle, text: "Plaintext secrets sitting on host disk" },
  { icon: AlertTriangle, text: "Manual container restarts for secret rotation" },
];

const solutions = [
  { icon: ShieldCheck, text: "Zero-Persistence: Secrets never touch the disk" },
  { icon: Zap, text: "Auto-Rotation: Event-driven secret updates" },
  { icon: CheckCircle2, text: "Native: Works directly with Docker & Compose" },
];

export const ProblemSolution = () => {
  return (
    <section className="py-12 sm:py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading for SEO and structure */}
        <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 text-center text-foreground">
          Why Traditional Secret Management Falls Short
        </h2>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">

          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-red-500/5 border border-red-500/10"
          >
            <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-4 sm:mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              The Status Quo
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {painPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-xs sm:text-sm lg:text-base">
                  <point.icon className="w-4 sm:w-5 h-4 sm:h-5 text-red-500/50 shrink-0 mt-0.5" />
                  {point.text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* DSO Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-accent/5 border border-accent/20 shadow-[0_0_40px_rgba(0,230,192,0.05)]"
          >
            <h3 className="text-lg sm:text-xl font-bold text-accent mb-4 sm:mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              The DSO Way
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200 text-xs sm:text-sm lg:text-base font-medium">
                  <sol.icon className="w-4 sm:w-5 h-4 sm:h-5 text-accent shrink-0 mt-0.5" />
                  {sol.text}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
