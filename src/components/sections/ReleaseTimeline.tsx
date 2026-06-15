"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Calendar, BarChart3 } from "lucide-react";

export const ReleaseTimeline = () => {
  const releases = [
    {
      version: "v3.2.0",
      date: "2025-12-15",
      type: "Major",
      changes: [
        "Multi-secret atomic transactions",
        "Advanced health check configuration",
        "Improved checkpoint recovery"
      ],
      stats: { downloads: 15200, contributors: 8 }
    },
    {
      version: "v3.1.5",
      date: "2025-11-20",
      type: "Patch",
      changes: [
        "Fixed provider timeout handling",
        "Improved logging clarity",
        "Performance optimization for large secrets"
      ],
      stats: { downloads: 12800, contributors: 5 }
    },
    {
      version: "v3.1.0",
      date: "2025-10-10",
      type: "Minor",
      changes: [
        "Added Azure Key Vault support",
        "Enhanced CLI output formatting",
        "Simplified configuration schema"
      ],
      stats: { downloads: 18500, contributors: 12 }
    },
    {
      version: "v3.0.0",
      date: "2025-08-01",
      type: "Major",
      changes: [
        "Complete rewrite for production stability",
        "Checkpoint-based recovery system",
        "Native Docker Compose integration"
      ],
      stats: { downloads: 24300, contributors: 15 }
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
            Release History
          </h2>
          <p className="text-lg text-gray-400">
            Active development with continuous improvements. Every release validated and production-tested.
          </p>
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
              <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50 transition-all duration-300">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" />
                        <span className="font-mono font-bold text-accent text-lg">{release.version}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        release.type === 'Major' ? 'bg-accent/20 text-accent' :
                        release.type === 'Minor' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-700/30 text-gray-300'
                      }`}>
                        {release.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(release.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {release.changes.map((change, cidx) => (
                        <li key={cidx} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-accent flex-shrink-0">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-6 sm:flex-col text-right sm:text-left">
                    <div className="min-w-max">
                      <p className="text-xs text-gray-400 mb-1">Downloads</p>
                      <p className="text-lg font-bold text-accent font-mono">{(release.stats.downloads / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="min-w-max">
                      <p className="text-xs text-gray-400 mb-1">Contributors</p>
                      <p className="text-lg font-bold text-blue-400 font-mono">{release.stats.contributors}</p>
                    </div>
                  </div>
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
            <BarChart3 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Release Cadence</h3>
              <p className="text-sm text-gray-400">
                New releases every 6-8 weeks. Patch releases as needed for critical fixes. All releases undergo security review and production validation before release.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
