"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Server,
  Radio,
  Zap,
  Database,
  Lock,
  Cpu,
  Package,
  GitBranch,
} from "lucide-react";

interface ComponentArchitectureProps {
  variant?: "compact" | "detailed";
  className?: string;
}

const ComponentNode = ({
  icon: Icon,
  title,
  description,
  isCenter = false,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  isCenter?: boolean;
  delay?: number;
}) => {
  const baseClass = isCenter
    ? "w-16 h-16 sm:w-20 sm:h-20"
    : "w-14 h-14 sm:w-16 sm:h-16";
  const iconSize = isCenter ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6 sm:w-7 sm:h-7";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative flex flex-col items-center"
    >
      {/* Icon circle */}
      <div
        className={`${baseClass} rounded-xl ${
          isCenter ? "bg-accent/20 border-2 border-accent" : "bg-accent/10 border border-accent/30"
        } flex items-center justify-center flex-shrink-0`}
      >
        <Icon
          className={`${iconSize} text-accent`}
        />
      </div>

      {/* Labels positioned absolutely below the circle to avoid shifting it */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-32 pointer-events-none">
        <div
          className={`font-semibold text-foreground leading-tight ${
            isCenter ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"
          }`}
        >
          {title}
        </div>
        <div className={`text-gray-500 leading-tight mt-0.5 ${isCenter ? "text-[8px] sm:text-[9px]" : "text-[7px] sm:text-[8px]"}`}>
          {description}
        </div>
      </div>
    </motion.div>
  );
};

export const ComponentArchitecture = ({
  variant = "detailed",
  className = "",
}: ComponentArchitectureProps) => {
  // Peripheral components arranged in circle
  const components = [
    {
      icon: GitBranch,
      title: "IPC Controller",
      description: "Unix socket",
      angle: 0,
    },
    {
      icon: Radio,
      title: "Docker Event",
      description: "Watcher",
      angle: 60,
    },
    {
      icon: Zap,
      title: "Rotation",
      description: "Engine",
      angle: 120,
    },
    {
      icon: Database,
      title: "State",
      description: "Manager",
      angle: 180,
    },
    {
      icon: Lock,
      title: "Distributed",
      description: "Lock",
      angle: 240,
    },
    {
      icon: Package,
      title: "Plugin",
      description: "Manager",
      angle: 300,
    },
  ];

  return (
    <section className={`w-full bg-background ${className}`}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Agent Architecture
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Seven coordinated components orchestrate secret rotation and recovery.
        </p>
      </motion.div>

      {/* Desktop: radial layout */}
      <div className="hidden md:flex justify-center items-center mb-12">
        <div className="relative w-full max-w-lg aspect-square">
          {/* Background gradient circles */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-accent/10"
          />
          <motion.div
            animate={{ opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-1/4 rounded-full border border-accent/20"
          />

          {/* Center component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ComponentNode
              icon={Server}
              title="dso-agent"
              description="Core daemon"
              isCenter={true}
              delay={0}
            />
          </div>

          {/* Peripheral components arranged in circle */}
          <div className="absolute inset-0">
            {components.map((comp, idx) => {
              const rad = (comp.angle * Math.PI) / 180;
              const radiusPercent = 40; // 40% from center
              const x = Math.round((50 + radiusPercent * Math.cos(rad)) * 10000) / 10000;
              const y = Math.round((50 + radiusPercent * Math.sin(rad)) * 10000) / 10000;

              return (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <ComponentNode
                    icon={comp.icon}
                    title={comp.title}
                    description={comp.description}
                    delay={0.1 * (idx + 1)}
                  />
                </div>
              );
            })}
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
              </marker>
            </defs>
            {components.map((comp, idx) => {
              const rad = (comp.angle * Math.PI) / 180;
              const x1 = Math.round((50 + 8.5 * Math.cos(rad)) * 10000) / 10000;
              const y1 = Math.round((50 + 8.5 * Math.sin(rad)) * 10000) / 10000;
              const x2 = Math.round((50 + 32.5 * Math.cos(rad)) * 10000) / 10000;
              const y2 = Math.round((50 + 32.5 * Math.sin(rad)) * 10000) / 10000;

              return (
                <motion.line
                  key={idx}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrow)"
                  className="text-accent/30"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 * idx }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col gap-6 sm:gap-8">
        {/* Center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <ComponentNode
            icon={Server}
            title="dso-agent"
            description="Core daemon"
            isCenter={true}
          />
        </motion.div>

        {/* Grid of peripherals */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {components.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="flex justify-center"
            >
              <ComponentNode
                icon={comp.icon}
                title={comp.title}
                description={comp.description}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-16 sm:mt-24 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-surface/20 border border-border/40"
      >
        <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">
          Key Interactions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>IPC Controller: CLI commands & queries</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Watcher: Docker event stream</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Engine: Orchestrates rotations</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>State Manager: Write-ahead logs</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Lock Manager: Distributed coordination</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Plugin Manager: Provider isolation</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
