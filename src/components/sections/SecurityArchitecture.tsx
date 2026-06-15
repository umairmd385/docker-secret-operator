"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Lock,
  Zap,
  Container,
  Trash2,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface ArchStage {
  icon: React.ReactNode;
  title: string;
  role: string;
  details: string[];
  color: "blue" | "teal" | "green";
}

const colorMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
  },
  teal: {
    bg: "bg-accent/10",
    border: "border-accent/30",
    icon: "text-accent",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: "text-green-400",
  },
};

const ArchStageCard = ({
  icon,
  title,
  role,
  details,
  color,
  index,
}: ArchStage & { index: number }) => {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`p-5 rounded-lg border ${colors.border} ${colors.bg} space-y-3`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}
        >
          <div className={colors.icon}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{role}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-2 text-gray-400">
            <span className={`${colors.icon} mt-0.5 flex-shrink-0`}>•</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const SecurityArchitecture = () => {
  const stages: ArchStage[] = [
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "Secret Provider",
      role: "Source of truth",
      details: [
        "Vault, AWS Secrets Manager, Azure Key Vault, or Local",
        "DSO continuously monitors for changes",
        "TLS encryption in transit",
      ],
      color: "blue",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "DSO Agent",
      role: "Orchestrator",
      details: [
        "Detects secret changes from provider",
        "Acquires lock to prevent concurrent rotations",
        "Manages rotation orchestration",
        "Runs health checks on new containers",
      ],
      color: "teal",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Local Memory",
      role: "Temporary cache",
      details: [
        "Plaintext in memory only during rotation",
        "Never persisted to disk",
        "Lost immediately after container swap",
        "Encrypted vault stores encrypted backup",
      ],
      color: "teal",
    },
    {
      icon: <Container className="w-5 h-5" />,
      title: "New Container",
      role: "Health candidate",
      details: [
        "Spawned with new secret via tmpfs",
        "Health checks validate readiness",
        "Configurable timeout window",
        "Rollback if checks fail",
      ],
      color: "green",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Atomic Swap",
      role: "Traffic handoff",
      details: [
        "Rename containers at Docker daemon level",
        "Traffic switches instantly",
        "Old container never stops until new is healthy",
        "Zero dropped connections",
      ],
      color: "green",
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: "Cleanup",
      role: "State reset",
      details: [
        "Old container stops",
        "Secrets purged from memory",
        "Lock released for next rotation",
        "Rotation complete and safe",
      ],
      color: "teal",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Security Architecture
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            How DSO manages secrets internally. Every stage is secure, auditable, and resilient.
          </p>
        </motion.div>

        {/* Architecture flow - responsive grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stages.map((stage, idx) => (
            <ArchStageCard key={idx} {...stage} index={idx} />
          ))}
        </div>

        {/* Key principles */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent flex-shrink-0" />
              <h4 className="font-semibold text-foreground text-sm">
                In-Memory Only
              </h4>
            </div>
            <p className="text-xs text-gray-400">
              Secrets exist in plaintext only during the rotation window. Never
              persisted to disk. Memory released immediately after container
              swap.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent flex-shrink-0" />
              <h4 className="font-semibold text-foreground text-sm">
                Atomic Swap
              </h4>
            </div>
            <p className="text-xs text-gray-400">
              Containers renamed at the Docker daemon level. Old container stays
              running until new is fully healthy. Traffic switches instantly.
              Zero downtime.
            </p>
          </motion.div>
        </div>

        {/* Guarantee box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto p-6 rounded-lg border border-green-500/20 bg-green-500/5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Secure-by-Design
              </h4>
              <p className="text-xs text-gray-400">
                DSO enforces security at every stage: provider encryption,
                in-memory-only secrets, atomic handoffs, and instant cleanup.
                No long-lived plaintext. No orphaned containers. No exposure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
