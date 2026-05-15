"use client";

import React from "react";
import { motion } from "framer-motion";

export const OperationalTopology = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />

      {/* Grid pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        preserveAspectRatio="none"
        style={{
          background: `
            linear-gradient(90deg, rgba(0, 230, 192, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 230, 192, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px"
        }}
      />

      {/* Animated glow circles - Left side (Telemetry Blue) */}
      <motion.div
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0) 70%)"
        }}
        animate={{
          y: [0, 30, 0],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated glow circles - Right side (Infrastructure Cyan) */}
      <motion.div
        className="absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-[150px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 229, 194, 0.08) 0%, rgba(0, 229, 194, 0) 70%)"
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Center accent glow (Layered Blue-Cyan) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(79, 140, 255, 0.06) 0%, rgba(0, 229, 194, 0.04) 50%, rgba(79, 140, 255, 0) 70%)"
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated operational nodes - Top left */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-accent/40 shadow-lg shadow-accent/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated operational nodes - Top right */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-accent/50 shadow-lg shadow-accent/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Animated operational nodes - Bottom center */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent/35 shadow-lg shadow-accent/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.6, 0.25]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      {/* Animated connecting lines (subtle) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ pointerEvents: "none" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 230, 192, 0.5)" />
            <stop offset="100%" stopColor="rgba(0, 230, 192, 0)" />
          </linearGradient>
        </defs>

        {/* Line 1: Top-left to center */}
        <motion.line
          x1="25%"
          y1="25%"
          x2="50%"
          y2="50%"
          stroke="url(#nodeGradient)"
          strokeWidth="1.5"
          opacity={0.3}
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Line 2: Top-right to center */}
        <motion.line
          x1="75%"
          y1="33%"
          x2="50%"
          y2="50%"
          stroke="url(#nodeGradient)"
          strokeWidth="1.5"
          opacity={0.3}
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />

        {/* Line 3: Bottom center to center */}
        <motion.line
          x1="50%"
          y1="75%"
          x2="50%"
          y2="50%"
          stroke="url(#nodeGradient)"
          strokeWidth="1.5"
          opacity={0.3}
          animate={{
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
        />
      </svg>

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"
        animate={{
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};
