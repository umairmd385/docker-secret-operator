"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Package,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ChevronRight,
} from "lucide-react";

interface RotationFlowProps {
  variant?: "compact" | "detailed";
  showAnimation?: boolean;
  className?: string;
}

const FlowStep = ({
  icon: Icon,
  label,
  sublabel,
  index,
  total,
}: {
  icon: any;
  label: string;
  sublabel?: string;
  index: number;
  total: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex flex-col items-center gap-3 flex-shrink-0 w-24 sm:w-32"
  >
    {/* Icon circle */}
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
    </div>

    {/* Label */}
    <div className="text-center px-1">
      <div className="text-xs sm:text-sm font-bold text-foreground leading-tight">
        {label}
      </div>
      {sublabel && (
        <div className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase mt-1">
          {sublabel}
        </div>
      )}
    </div>
  </motion.div>
);

const MobileArrow = () => (
  <motion.div
    animate={{ y: [0, 4, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="flex md:hidden items-center justify-center text-accent/50 py-2"
  >
    <ChevronRight className="w-5 h-5 rotate-90 text-accent" />
  </motion.div>
);

export const RotationFlow = ({
  variant = "detailed",
  showAnimation = true,
  className = "",
}: RotationFlowProps) => {
  const steps = [
    {
      icon: Eye,
      label: "Secret Changes",
      sublabel: "Watch detected",
    },
    {
      icon: Package,
      label: "Spawn Green",
      sublabel: "New container",
    },
    {
      icon: CheckCircle2,
      label: "Health Check",
      sublabel: "Validate running",
    },
    {
      icon: RefreshCw,
      label: "Atomic Swap",
      sublabel: "Zero downtime",
    },
    {
      icon: Trash2,
      label: "Cleanup",
      sublabel: "Stop old container",
    },
  ];

  return (
    <section className={`w-full bg-background ${className}`}>
      {/* Desktop layout: horizontal flow */}
      <div className="hidden md:flex flex-col gap-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Zero-Downtime Rotation
          </h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            5 steps completed in seconds. No connections dropped.
          </p>
        </motion.div>

        {/* Horizontal flow */}
        <div className="flex items-start justify-center gap-0 overflow-x-auto pb-4">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <FlowStep
                icon={step.icon}
                label={step.label}
                sublabel={step.sublabel}
                index={idx}
                total={steps.length}
              />

              {/* Connecting arrow directly between icon circles */}
              {idx < steps.length - 1 && (
                <div className="flex-shrink-0 self-start mt-5 sm:mt-6 px-1 sm:px-2 flex items-center justify-center">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                    className="flex items-center text-accent/50"
                  >
                    <div className="h-0.5 w-6 sm:w-10 bg-gradient-to-r from-accent/40 to-accent" />
                    <ChevronRight className="w-4 h-4 -ml-1 text-accent" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Timeline indicator */}
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-gray-500 mt-2"
          >
            ⏱️ Total time: ~5 seconds
          </motion.div>
        )}
      </div>

      {/* Mobile layout: vertical flow */}
      <div className="md:hidden flex flex-col gap-0">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Zero-Downtime Rotation
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            5 steps in ~5 seconds
          </p>
        </motion.div>

        {/* Vertical flow */}
        <div className="flex flex-col items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <FlowStep
                icon={step.icon}
                label={step.label}
                sublabel={step.sublabel}
                index={idx}
                total={steps.length}
              />
              {idx < steps.length - 1 && <MobileArrow />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
