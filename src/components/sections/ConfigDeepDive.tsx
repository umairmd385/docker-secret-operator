"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server, Lock, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const ConfigDeepDive = () => {
  const internals = [
    {
      title: "1. Provider Map",
      description: "Define one or multiple backends. An application can simultaneously pull an AWS DB password and an Azure API key into the same container.",
      icon: Server
    },
    {
      title: "2. Memory Targets",
      description: "Specify exactly where the file mounts. DSO strictly maps to '/run/secrets' or user-defined RAMfs paths to ensure zero-persistence.",
      icon: Lock
    },
    {
      title: "3. Hot Checksums",
      description: "When the agent starts, it saves a SHA-256 hash of the payload in memory. If AWS changes the secret, DSO rotates the target container automatically.",
      icon: RefreshCw
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 border-t border-border bg-surface2/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
            Under the hood
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed">
            A closer look at how DSO configurations provide maximum deterministic safety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {internals.map((item, idx) => (
            <Card key={idx} className="group hover:bg-surface/50 border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-surface border border-accent/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:border-accent transition-colors shrink-0">
                  <item.icon className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold mb-2">{item.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-1">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
