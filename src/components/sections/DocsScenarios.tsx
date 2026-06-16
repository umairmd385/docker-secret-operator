"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Key, FileText, AlertCircle } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const DocsScenarios = () => {
  const scenarios = [
    {
      icon: Database,
      title: "Database Credentials",
      description: "Rotate database passwords without restart",
      next: "Docs: Providers → Configure your database provider",
    },
    {
      icon: Key,
      title: "API Keys",
      description: "Keep API keys fresh and update automatically",
      next: "Docs: Operations → Set up health checks for API endpoints",
    },
    {
      icon: FileText,
      title: "TLS Certificates",
      description: "Update SSL certificates before expiration",
      next: "Docs: Architecture → Understand validation flow",
    },
    {
      icon: AlertCircle,
      title: "Recovery After Failure",
      description: "Recover automatically from crashes and errors",
      next: "Docs: Operations → Troubleshooting guide",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <H2 className="mb-4">Common Scenarios</H2>
          <PLead className="text-secondary">
            Jump to what you need. Each scenario guides you to the right documentation.
          </PLead>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {scenarios.map((scenario, idx) => {
            const Icon = scenario.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {scenario.title}
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      {scenario.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-4 border-t border-border">
                  <span className="text-accent font-bold flex-shrink-0 mt-0.5">→</span>
                  <p className="text-xs text-secondary">{scenario.next}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
