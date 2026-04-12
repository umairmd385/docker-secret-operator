"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Shield, Layers, Zap, Cpu, RefreshCw, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const features = [
  {
    title: "Zero Persistence RAMfs",
    description: "Secrets are mapped to tmpfs RAM limits. They are lost immediately if the host loses power, preventing cold-boot forensic theft. Never written to the host filesystem.",
    icon: Shield,
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Docker Event Driven",
    description: "Leverages the Docker Event stream for real-time lifecycle hooks instead of CPU-heavy polling intervals.",
    icon: Zap,
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Smart Checksum Rotation",
    description: "Calculates an SHA-256 hash. Triggers docker container rotation only if the secret payload actually changes.",
    icon: RefreshCw,
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Multi-Cloud Capable",
    description: "A single instance can bridge AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, and local files directly into containers.",
    icon: Layers,
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Native CLI Plugin",
    description: "DSO is bundled as a single binary Docker CLI plugin. Execute `docker dso up` directly from your root project.",
    icon: Cpu,
    colSpan: "col-span-1 lg:col-span-3",
  }
];

export const FeaturesBento = () => {
  return (
    <section id="features" className="py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Architecture-first approach to local secret orchestration.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            Stop compromising on security. Provide production credentials safely without the Kubernetes learning curve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={feature.colSpan}
            >
              <Card className="group h-full hover:border-accent/40 bg-[#0a0f16]">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
