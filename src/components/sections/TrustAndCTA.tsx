"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const TrustAndCTA = () => {
  const capabilities = [
    {
      title: "Automatic Rotation",
      desc: "Detects secret changes and rotates containers without manual intervention.",
    },
    {
      title: "Health-Checked Updates",
      desc: "New containers pass health checks before traffic switches. Failed rotations roll back.",
    },
    {
      title: "Recovery Built In",
      desc: "Crashes don't cause incidents. DSO resumes from checkpoint on restart.",
    },
    {
      title: "Docker Native",
      desc: "Works with Docker Engine directly. No Kubernetes required.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Capability Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl border border-gray-800 bg-gray-900/30"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{cap.title}</h3>
                  <p className="text-sm text-gray-400">{cap.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/30 p-12 sm:p-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to automate secret rotation?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Install DSO and deploy your first automated rotation in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#quick-start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Install DSO
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-700 hover:border-accent/50 bg-gray-900/30 hover:bg-gray-900/50 text-foreground font-semibold rounded-lg transition-all"
            >
              Read Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
