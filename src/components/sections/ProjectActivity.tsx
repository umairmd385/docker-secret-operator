"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Users, Zap, Calendar } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const ProjectActivity = () => {
  const metrics = [
    {
      icon: Star,
      label: "GitHub Stars",
      value: "12",
      description: "Early-stage project with steady growth"
    },
    {
      icon: Users,
      label: "Core Contributors",
      value: "2",
      description: "Focused team driving development"
    },
    {
      icon: Zap,
      label: "Releases",
      value: "29",
      description: "Consistent release cadence since April 2026"
    },
    {
      icon: Calendar,
      label: "Active Since",
      value: "Apr 2026",
      description: "New project, rapidly maturing"
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <H2 className="mb-4">Project Status</H2>
          <PLead className="text-secondary">
            Real, verifiable metrics from our GitHub repository. No invented statistics.
          </PLead>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {metric.label}
                  </h3>
                </div>
                <p className="text-3xl font-bold text-accent mb-2">
                  {metric.value}
                </p>
                <p className="text-sm text-secondary">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Transparency Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-lg border border-accent/20 bg-accent/5 space-y-4"
        >
          <h3 className="font-semibold text-foreground text-lg">About DSO</h3>
          <p className="text-gray-300 leading-relaxed">
            DSO is a focused, well-maintained open source project. We're a small core team with a clear mission: zero-persistence secret injection for Docker. We prioritize code quality, security, and reliability over vanity metrics.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our rapid release cycle (29 releases in ~2 months) shows active development and responsiveness to issues. Every number on this page can be verified on <a href="https://github.com/docker-secret-operator/dso" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">our GitHub repository</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
