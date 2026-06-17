"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Terminal } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const ProductPreview = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <H2 className="mb-4">CLI-First Control</H2>
          <PLead className="text-tertiary">
            Full visibility and control from the command line. Simple, powerful, transparent.
          </PLead>
        </motion.div>

        {/* CLI Output */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface2 rounded-lg border border-border p-6 font-mono text-sm mb-16"
        >
          <div className="space-y-2 text-foreground-alt">
            <div><span className="text-accent">$</span> dso status</div>
            <div className="text-secondary">
              Status: running
              <br />
              Provider: aws-secrets-manager
              <br />
              Uptime: 45 days
              <br />
              Last rotation: 2 minutes ago
            </div>
            <div className="mt-4"><span className="text-accent">$</span> dso logs --tail 5</div>
            <div className="text-secondary mt-2">
              <div>[INFO] Rotation initiated for: database_password</div>
              <div>[INFO] Health checks: PASSED</div>
              <div>[INFO] Atomic swap: COMPLETED</div>
              <div>[INFO] Cleanup: COMPLETED</div>
              <div className="text-green-400">[INFO] Success: database_password rotated</div>
            </div>
          </div>
        </motion.div>

        {/* Key features */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "CLI Control", description: "Full control from the command line. Simple and transparent." },
            { icon: <Terminal className="w-5 h-5" />, title: "Real Logs", description: "Complete audit trail of every rotation. No fake metrics." },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-tertiary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
