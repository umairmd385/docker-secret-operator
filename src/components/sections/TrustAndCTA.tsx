"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Code, Shield, Users } from "lucide-react";
import { H2, P, PSmall } from "@/components/ui/Typography";

export const TrustAndCTA = () => {
  const signals = [
    {
      icon: <Code className="w-5 h-5" />,
      label: "31 releases",
      description: "Active development & maintenance",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Apache 2.0",
      description: "Open source & permissive license",
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: "CNCF Sandbox",
      description: "Cloud Native Computing Foundation",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Small focused team",
      description: "Built for operational clarity",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {signals.map((signal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/50 transition-all space-y-3"
            >
              <div className="text-accent">{signal.icon}</div>
              <div>
                <p className="font-semibold text-foreground">{signal.label}</p>
                <PSmall className="text-tertiary mt-1">{signal.description}</PSmall>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recovery guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-lg border border-accent/20 bg-accent/5 space-y-3"
        >
          <p className="text-foreground font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" />
            Designed for failures
          </p>
          <P className="text-secondary">
            Automatic recovery handles crashes, timeouts, and network interruptions. No manual intervention needed.
          </P>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-surface/30 p-12 sm:p-16 text-center"
        >
          <H2 className="mb-4">Ready to automate secret rotation?</H2>
          <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Install DSO and deploy your first automated rotation in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="/deploy"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Deploy DSO
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border-soft hover:border-accent/50 bg-surface/30 hover:bg-surface/50 text-foreground font-semibold rounded-lg transition-all"
            >
              Read Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
