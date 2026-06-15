"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Code, Users, Target } from "lucide-react";

export const MaintainerPhilosophy = () => {
  const philosophies = [
    {
      icon: Target,
      title: "Focused Scope",
      description: "Do one thing well. DSO solves zero-persistence secret injection for Docker. We stay focused on that mission."
    },
    {
      icon: Code,
      title: "Code Quality",
      description: "Small team means every line matters. We prioritize readability, testability, and maintainability."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Secrets are sensitive. We treat security as a core feature, not an afterthought."
    },
    {
      icon: Users,
      title: "Direct Feedback",
      description: "Our users directly influence development. We listen to real-world use cases and pain points."
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
            How We Build
          </h2>
          <p className="text-lg text-gray-400">
            Principles guiding our development and maintenance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {philosophies.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-lg border border-accent/20 bg-accent/5"
        >
          <h3 className="font-semibold text-foreground text-lg mb-3">Small Team, Big Impact</h3>
          <p className="text-gray-300 text-sm">
            DSO is maintained by a small, focused team. This means we can move quickly, make thoughtful decisions, and stay true to our mission. We're not building a platform for everyone — we're building the best zero-persistence secret injection tool for Docker.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
