"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Lock,
  Database,
  Container,
  Shield,
  Trash2,
  Eye,
} from "lucide-react";

interface FlowStage {
  icon: React.ReactNode;
  title: string;
  location: string;
  state: string;
  security: string;
}

const FlowStage = ({
  icon,
  title,
  location,
  state,
  security,
  index,
  isLast,
}: FlowStage & { index: number; isLast: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
    className="flex flex-col items-center"
  >
    {/* Stage box */}
    <div className="w-full max-w-xs p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
          <div className="text-accent">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>

      {/* State */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-fit">State:</span>
          <span className="text-gray-400">{state}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-fit">Security:</span>
          <span className="text-accent">{security}</span>
        </div>
      </div>
    </div>

    {/* Arrow to next stage */}
    {!isLast && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index + 0.5) * 0.08, duration: 0.3 }}
        className="flex flex-col items-center my-4"
      >
        <div className="h-6 border-l border-accent/30" />
        <div className="w-1 h-1 rounded-full bg-accent/40" />
      </motion.div>
    )}
  </motion.div>
);

export const SecretFlowStory = () => {
  const flowStages: FlowStage[] = [
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "Secret Provider",
      location: "AWS, Azure, Vault, or Local",
      state: "Plaintext in provider",
      security: "Provider's encryption (TLS in transit)",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "DSO Cache",
      location: "Local encrypted vault",
      state: "Encrypted on disk (/etc/dso/vault.enc)",
      security: "Encrypted at rest (AES-256)",
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Memory (tmpfs)",
      location: "DSO process memory",
      state: "Plaintext in memory (temporary)",
      security: "Not persisted to disk. Exists only during rotation.",
    },
    {
      icon: <Container className="w-5 h-5" />,
      title: "Container tmpfs",
      location: "Container runtime",
      state: "Plaintext available to container",
      security: "Memory-only. Lost on container stop. Not in logs.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Application",
      location: "Running process",
      state: "Application reads secret from environment",
      security: "Application responsible for secret handling",
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: "Cleanup",
      location: "After rotation complete",
      state: "Old secret removed from memory",
      security: "Old container stopped. Memory released. Vault updated.",
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
            Secret Flow
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            How secrets travel from provider to application. Every step is secure.
          </p>
        </motion.div>

        {/* Flow stages (vertical on mobile, grid on larger) */}
        <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:items-center lg:flex-wrap lg:gap-8">
          <div className="w-full lg:w-auto flex flex-col items-center">
            {flowStages.map((stage, idx) => (
              <FlowStage
                key={idx}
                {...stage}
                index={idx}
                isLast={idx === flowStages.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Key principles */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              <h4 className="font-semibold text-foreground text-sm">Encrypted at Rest</h4>
            </div>
            <p className="text-xs text-gray-400">
              Vault encrypted. Secrets never persisted on disk except in encrypted cache.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              <h4 className="font-semibold text-foreground text-sm">Memory Only</h4>
            </div>
            <p className="text-xs text-gray-400">
              Secrets in memory during rotation. Released immediately after container
              swap. Not written to logs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-accent" />
              <h4 className="font-semibold text-foreground text-sm">Instant Cleanup</h4>
            </div>
            <p className="text-xs text-gray-400">
              Old container stops immediately. Old secrets purged from memory. Zero
              residual exposure.
            </p>
          </motion.div>
        </div>

        {/* Security model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-6 rounded-lg border border-green-500/20 bg-green-500/5"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Zero Disk Persistence
              </h4>
              <p className="text-xs text-gray-400">
                Secrets exist only in memory during the rotation window. They are never
                written to disk in plaintext. The encrypted vault stores only the encrypted
                copy. When the container stops, the secret is gone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
