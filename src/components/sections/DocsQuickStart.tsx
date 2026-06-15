"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";

export const DocsQuickStart = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: "Install DSO",
      command: "curl -fsSL https://dso.sh/install | bash",
      description: "Get the DSO binary on your system",
    },
    {
      title: "Create docker-compose.yml",
      command: `version: '3.8'
services:
  app:
    image: myapp:latest
    environment:
      - DB_PASSWORD=\${DB_PASSWORD}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 5s`,
      description: "Define your application with health checks",
    },
    {
      title: "Create dso.yaml",
      command: `vault:
  type: local
  path: ~/.dso/vault.enc
services:
  - name: app
    container: app
    secrets:
      - DB_PASSWORD
    healthChecks:
      enabled: true
      timeout: 30s`,
      description: "Configure DSO for your application",
    },
    {
      title: "Initialize vault",
      command: "dso init",
      description: "Create encrypted local vault and set passphrase",
    },
    {
      title: "Add your first secret",
      command: 'dso secret set DB_PASSWORD "your-database-password"',
      description: "Store a secret safely",
    },
    {
      title: "Run with DSO",
      command: "dso up -f docker-compose.yml",
      description: "Start your application with automatic secret rotation",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            START HERE
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Get Running in 5 Minutes
          </h2>
          <p className="text-lg text-gray-400">
            Six steps from installation to your first rotation. Docker Compose users can be productive immediately.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>

              {/* Command Box */}
              <div className="ml-12 mb-6">
                <div className="relative bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                    <Terminal className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 font-mono">bash</span>
                  </div>
                  <div className="p-4">
                    <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words">
                      {step.command}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(step.command, idx)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
                  >
                    {copiedStep === idx ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl p-8 rounded-lg border border-accent/20 bg-accent/5"
        >
          <h3 className="font-semibold text-foreground text-lg mb-4">What's Next?</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Configure a provider:</span> AWS, Azure, Vault, or local vault
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Enable health checks:</span> Ensure safe rotation validation
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Test rotation:</span> Verify secrets update without downtime
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">→</span>
              <span>
                <span className="font-medium">Deploy to production:</span> Apply to your real workloads
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
