"use client";

import React from "react";
import { motion } from "framer-motion";
import { SecurityBoundaries } from "@/components/diagrams/SecurityBoundaries";
import { Lock, Zap, RotateCcw, Database, Shield } from "lucide-react";

interface DataFlowStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
}

const DataFlowStepComponent = ({ icon, title, description, detail, index }: DataFlowStep & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="space-y-2"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
        <div className="text-accent text-sm font-bold">{index + 1}</div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-accent">{icon}</div>
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        </div>
        <p className="text-xs text-gray-400">{description}</p>
        <p className="text-xs text-gray-500 mt-1 font-mono">{detail}</p>
      </div>
    </div>
  </motion.div>
);


export const SecurityArchitecture = () => {
  const dataFlowSteps: DataFlowStep[] = [
    {
      icon: <Database className="w-4 h-4" />,
      title: "Secret Resolution",
      description: "Agent authenticates to vault using machine identity (IAM instance profile, AppRole, etc.)",
      detail: "TLS 1.2+ connection, no hardcoded credentials on host",
    },
    {
      icon: <Lock className="w-4 h-4" />,
      title: "Memory Acquisition",
      description: "Secret fetched and held exclusively in dso-agent heap (never touches disk)",
      detail: "In-memory cache with TTL, purged on agent stop or timeout",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "TAR Generation",
      description: "In-memory TAR archive created with secret files and directory structure",
      detail: "Atomic construction in process memory, zero intermediate files",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Atomic Injection",
      description: "TAR streamed directly to container's tmpfs mount via Docker API",
      detail: "CopyToContainer operation completes atomically or fails completely",
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      title: "SIGHUP Reload",
      description: "App reloads secrets from tmpfs without container restart or traffic interruption",
      detail: "Signal sent only after entire payload successfully injected",
    },
  ];


  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Internal Security Model
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            How DSO protects secrets internally: Memory-only flow, zero disk persistence, atomic operations, trust boundaries. For security and compliance teams.
          </p>
        </motion.div>

        {/* Data Flow */}
        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl font-bold text-foreground"
          >
            The Data Flow (Provider → Agent → Container)
          </motion.h3>
          <div className="grid gap-4 sm:gap-6 max-w-3xl">
            {dataFlowSteps.map((step, index) => (
              <DataFlowStepComponent key={step.title} {...step} index={index} />
            ))}
          </div>
        </div>

        {/* Trust Boundaries */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl font-bold text-foreground mb-8"
          >
            Trust Boundaries & Isolation
          </motion.h3>
          <SecurityBoundaries variant="detailed" />
        </div>


        {/* Compliance Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            {
              title: "SOC2 Type II",
              points: ["Audit trails", "Access controls", "Incident response"],
            },
            {
              title: "PCI-DSS",
              points: ["No plaintext persistence", "Encryption in transit", "Least privilege access"],
            },
            {
              title: "ISO 27001",
              points: ["Identity-based access", "Secure communication", "Incident management"],
            },
          ].map((compliance, idx) => (
            <motion.div
              key={compliance.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 sm:p-6 rounded-lg border border-gray-800 bg-gray-900/30"
            >
              <h4 className="font-semibold text-foreground text-sm mb-3">{compliance.title}</h4>
              <ul className="space-y-2">
                {compliance.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
