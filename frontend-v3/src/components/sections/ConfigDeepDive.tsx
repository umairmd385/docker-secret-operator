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
    <section className="py-24 border-t border-border bg-surface2/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Under the hood
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            A closer look at how DSO configurations provide maximum deterministic safety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {internals.map((item, idx) => (
            <Card key={idx} className="group hover:bg-surface/50 border-border/50">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-surface border border-accent/20 flex items-center justify-center mb-4 group-hover:border-accent transition-colors">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <CardTitle className="text-lg font-bold mb-2">{item.title}</CardTitle>
                <CardDescription className="text-sm text-gray-400 leading-relaxed mt-1">
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
