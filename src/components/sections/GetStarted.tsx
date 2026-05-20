"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export const QuickStart = () => {
  const commands = [
    "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
    "docker dso init && docker dso secret set DB_PASSWORD your-secret",
    "docker compose up -d",
  ];

  const [copied, setCopied] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Get started in 2 minutes
          </h2>
          <p className="text-gray-400 text-lg">
            Copy, paste, done. Three commands.
          </p>
        </motion.div>

        <div className="space-y-4">
          {commands.map((cmd, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-700 bg-gray-900/50 hover:bg-gray-900/80 transition-colors">
                {/* Step Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                  {idx + 1}
                </div>

                {/* Command */}
                <div className="flex-1 min-w-0">
                  <code className="text-sm sm:text-base text-gray-300 font-mono break-all">
                    {cmd}
                  </code>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(cmd, idx)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy to clipboard"
                >
                  {copied === idx ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mt-2 ml-12">
                {idx === 0 && "Install the DSO Docker plugin"}
                {idx === 1 && "Initialize your local vault and set your first secret"}
                {idx === 2 && "Start your Docker stack. DSO handles secret rotation."}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl border border-green-500/30 bg-green-500/5 text-center"
        >
          <p className="text-green-400 font-mono text-sm">
            ✓ Running • Secrets rotating automatically • Zero downtime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
