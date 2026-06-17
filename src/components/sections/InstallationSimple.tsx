"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Code, Lock, Cloud, RotateCcw } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";
import Link from "next/link";

export const InstallationSimple = () => {
  const paths = [
    {
      id: "compose",
      icon: <Code className="w-6 h-6" />,
      title: "Docker Compose",
      subtitle: "Local development",
      href: "/deploy#compose",
    },
    {
      id: "aws",
      icon: <Cloud className="w-6 h-6" />,
      title: "AWS Secrets Manager",
      subtitle: "Production on AWS",
      href: "/deploy#aws",
    },
    {
      id: "vault",
      icon: <Lock className="w-6 h-6" />,
      title: "HashiCorp Vault",
      subtitle: "Self-hosted or cloud",
      href: "/deploy#vault",
    },
    {
      id: "local",
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Local Vault",
      subtitle: "Without cloud dependencies",
      href: "/deploy#local",
    },
  ];

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
          <H2 className="mb-4">Choose your deployment path.</H2>
          <PLead className="text-tertiary">
            Start with Docker Compose. Scale to production.
          </PLead>
        </motion.div>

        {/* Installation paths grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={path.href}
                className="block h-full p-6 rounded-lg border-2 border-border bg-surface/30 hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="text-tertiary group-hover:text-accent transition-colors mb-3">
                  {path.icon}
                </div>
                <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-accent transition-colors">
                  {path.title}
                </h3>
                <p className="text-sm text-tertiary mb-4">{path.subtitle}</p>
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <span>View details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
