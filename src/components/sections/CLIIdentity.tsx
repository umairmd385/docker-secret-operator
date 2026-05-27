"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle } from "lucide-react";

export const CLIIdentity = () => {
  const commands = [
    {
      title: "Initialize",
      command: "docker dso init",
      description: "Create encrypted local vault. Enter passphrase.",
      outcome: "Local vault initialized at ~/.dso/vault.enc. Encrypted at rest.",
    },
    {
      title: "Store Secrets",
      command: 'docker dso secret set DB_PASSWORD "prod-secret"',
      description: "Store secret in encrypted vault.",
      outcome: "Secret stored in encrypted vault. Ready for runtime injection.",
    },
    {
      title: "Rotate Containers",
      command: "docker dso up -f docker-compose.yml",
      description: "Start containers with DSO-managed secrets.",
      outcome: "Containers running with secrets injected at runtime. DSO monitors for changes.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-accent" />
            <p className="text-sm font-semibold text-accent uppercase tracking-wide">The Docker Secret Operator CLI</p>
          </div>
          <p className="text-base sm:text-lg text-gray-400">
            Simple, powerful commands for automated secret rotation.
          </p>
        </motion.div>

        {/* Command Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {commands.map((cmd, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 sm:p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-accent/30 transition-colors"
            >
              {/* Command Header */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">{cmd.title}</p>
                <code className="block text-xs sm:text-sm text-gray-300 font-mono bg-gray-950/50 p-2 rounded border border-gray-800 break-all">
                  {cmd.command}
                </code>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-3">{cmd.description}</p>

              {/* Outcome */}
              <div className="flex items-start gap-2 p-2 rounded bg-green-500/5 border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-400 font-medium">{cmd.outcome}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 mt-6 text-center"
        >
          Docker native. Works with any container. No agents required for local development.
        </motion.p>
      </div>
    </section>
  );
};
