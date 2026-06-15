"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Shield, Zap } from "lucide-react";

export const MaintainerPhilosophy = () => {
  const philosophies = [
    {
      icon: Heart,
      title: "Reliability First",
      description: "Production stability matters more than feature velocity. We prioritize correctness and safety over speed."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Major decisions happen in the open. Roadmap is public. We listen to users and implement based on real problems."
    },
    {
      icon: Shield,
      title: "Security by Default",
      description: "Every release includes a security review. No shortcuts on cryptography or permission handling."
    },
    {
      icon: Zap,
      title: "Operational Clarity",
      description: "Code is for humans first. Clear error messages. Transparent failure modes. Observable behavior."
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
            Maintainer Philosophy
          </h2>
          <p className="text-lg text-gray-400">
            How we approach development, review, and maintenance.
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
                <p className="text-gray-400 leading-relaxed">
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
          <h3 className="font-semibold text-foreground text-lg mb-3">Core Principle</h3>
          <p className="text-gray-300">
            We believe that infrastructure software must be boring in all the right ways — highly reliable, transparent in behavior, and forgiving of operational mistakes. We optimize for the person operating DSO at 2 AM during an incident, not for the marketer writing launch copy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
