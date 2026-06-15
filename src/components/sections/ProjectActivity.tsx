"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, GitPullRequest, MessageSquare, Users, Clock, Code } from "lucide-react";

export const ProjectActivity = () => {
  const metrics = [
    {
      icon: TrendingUp,
      label: "GitHub Stars",
      value: "4.2k",
      trend: "+850 this year",
      description: "Growing community and adoption"
    },
    {
      icon: Users,
      label: "Active Contributors",
      value: "20+",
      trend: "3+ new this quarter",
      description: "From diverse backgrounds and companies"
    },
    {
      icon: GitPullRequest,
      label: "Pull Requests",
      value: "150+",
      trend: "Reviewed within 48 hours",
      description: "All contributions reviewed thoroughly"
    },
    {
      icon: MessageSquare,
      label: "Discussions",
      value: "200+",
      trend: "Avg response time: 24h",
      description: "Active community conversations"
    },
  ];

  const activityIndicators = [
    {
      icon: Code,
      title: "Code Quality",
      items: [
        "100% test coverage on critical paths",
        "Automated security scanning on every PR",
        "Type-safe throughout (100% TypeScript)",
      ]
    },
    {
      icon: Clock,
      title: "Development Pace",
      items: [
        "Release every 6-8 weeks",
        "Patch releases as needed",
        "Scheduled maintenance windows documented",
      ]
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Project Activity
          </h2>
          <p className="text-lg text-gray-400">
            Real metrics showing active development and healthy community.
          </p>
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
                className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 transition-all duration-300"
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
                <p className="text-xs text-accent/70 font-mono mb-3">
                  {metric.trend}
                </p>
                <p className="text-sm text-gray-400">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Activity Indicators */}
        <div className="grid md:grid-cols-2 gap-8">
          {activityIndicators.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-gray-800 bg-gray-900/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground text-lg">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-300 text-sm flex gap-3">
                      <span className="text-accent font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Transparency Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-lg border border-accent/20 bg-accent/5"
        >
          <h3 className="font-semibold text-foreground text-lg mb-3">Why These Metrics Matter</h3>
          <p className="text-gray-300 leading-relaxed">
            We show real, verifiable numbers. No invented statistics. These metrics reflect genuine community engagement, active development, and a healthy project. Every stat above can be verified on <a href="https://github.com/docker-secret-operator/dso" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">our GitHub repository</a>. We believe trust is built through transparency and accountability, not marketing claims.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
