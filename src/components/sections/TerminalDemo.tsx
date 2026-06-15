"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

export const TerminalDemo = () => {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress through demo
  useEffect(() => {
    if (activeStep < 6) {
      const timer = setTimeout(() => setActiveStep(activeStep + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const steps = [
    { type: "input", text: "$ dso rotate postgres-password" },
    { type: "output", text: "Detecting secret change..." },
    { type: "output", text: "✓ Secret fetched from provider" },
    { type: "output", text: "✓ Checkpoint created on disk" },
    { type: "output", text: "✓ Creating new container with updated credentials" },
    { type: "output", text: "✓ Waiting for application health checks (2.1s)" },
    { type: "output", text: "✓ Verifying database connections are working" },
    { type: "output", text: "✓ Atomic swap complete — traffic rerouted" },
    { type: "output", text: "✓ Old container stopped and removed" },
    { type: "output", text: "✓ Checkpoint cleaned up\n\n✅ Rotation completed in 2.3 seconds\n✅ Zero downtime — no requests failed\n✅ No manual intervention required" },
  ];

  const copyCommand = () => {
    navigator.clipboard.writeText("curl -fsSL https://dso.sh/install | bash");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Watch it work.
          </h2>
          <p className="text-lg text-gray-400">
            Rotation from detection to completion. Zero downtime. One command.
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 ml-4">terminal</span>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm h-64 overflow-hidden">
              <div className="space-y-3">
                {steps.slice(0, activeStep + 1).map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${
                      step.type === "input"
                        ? "text-accent"
                        : step.text.includes("🎉")
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {step.type === "input" ? (
                      <span>{step.text}</span>
                    ) : (
                      <>
                        <span className="text-accent mr-2">→</span>
                        <span>{step.text}</span>
                      </>
                    )}
                  </motion.div>
                ))}
                {activeStep < steps.length && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-gray-500"
                  >
                    █
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Install button below terminal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <div className="flex-1 max-w-md bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3 group hover:border-accent/50 transition-colors duration-300">
              <code className="text-sm text-gray-400 flex-1 truncate font-mono">
                curl -fsSL https://dso.sh/install | bash
              </code>
              <button
                onClick={copyCommand}
                className="p-2 rounded hover:bg-gray-800 transition-colors duration-200"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500 group-hover:text-accent" />
                )}
              </button>
            </div>
            <a
              href="https://github.com/docker-secret-operator/dso"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
            >
              View on GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Key message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300 font-medium mb-2">
            2.3 seconds. Zero downtime.
          </p>
          <p className="text-gray-500">
            No manual restarts. No monitoring dashboards. Just works.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
