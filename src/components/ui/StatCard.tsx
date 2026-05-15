"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  delay?: number;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-lg border border-accent/30 bg-gradient-to-br from-accent/8 to-blue-500/5 hover:from-accent/12 hover:to-blue-500/10 transition-all duration-300 shadow-lg shadow-accent/10 hover:shadow-accent/20"
    >
      {/* Telemetry blue accent glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <Icon className="w-5 h-5 text-accent flex-shrink-0 relative z-10" />
      <div className="flex flex-col gap-0.5 relative z-10">
        <p className="text-xs font-mono text-accent/70 uppercase tracking-wider">
          {label}
        </p>
        {value && <p className="text-sm font-semibold text-foreground">{value}</p>}
      </div>
    </motion.div>
  );
};
