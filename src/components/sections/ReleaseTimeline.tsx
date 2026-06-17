"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Calendar, Zap } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const ReleaseTimeline = () => {
  const releases = [
    {
      version: "v3.5.20",
      date: "2026-06-03",
      changes: [
        "Bug fixes and stability improvements",
        "Enhanced error handling"
      ]
    },
    {
      version: "v3.5.17",
      date: "2026-05-20",
      changes: [
        "Performance optimizations",
        "Improved logging"
      ]
    },
    {
      version: "v3.5.16",
      date: "2026-05-19",
      changes: [
        "Provider integration fixes",
        "Health check improvements"
      ]
    },
    {
      version: "v3.5.0",
      date: "2026-05-14",
      changes: [
        "Major feature enhancements",
        "API improvements"
      ]
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
          <H2 className="mb-4">Release History</H2>
          <PLead className="text-secondary">
            29 releases since project launch (April 2026). Consistent development and improvement.
          </PLead>
        </motion.div>

        <div className="space-y-6">
          {releases.map((release, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Tag className="w-5 h-5 text-accent" />
                    <span className="font-mono font-bold text-accent text-lg">{release.version}</span>
                  </div>
                  <p className="text-sm text-secondary flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <ul className="space-y-2">
                    {release.changes.map((change, cidx) => (
                      <li key={cidx} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-accent flex-shrink-0">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-lg border border-accent/20 bg-accent/5"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Active Development</h3>
              <p className="text-sm text-secondary">
                Frequent releases show rapid iteration and responsiveness to issues. Latest releases tracked on <a href="https://github.com/docker-secret-operator/dso/releases" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub releases page</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
