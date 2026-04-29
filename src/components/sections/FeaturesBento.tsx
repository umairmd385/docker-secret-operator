"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Cpu, RefreshCw } from "lucide-react";

const features = [
  {
    title: "Dual-Mode Execution",
    description: "Automatic environment detection for seamless switching between Native Vault and Cloud plugins.",
    icon: Zap
  },
  {
    title: "Zero Persistence RAMfs",
    description: "Secrets are mapped to tmpfs RAM limits. Never written to host disk as plaintext.",
    icon: Shield
  },
  {
    title: "Verified Plugin System",
    description: "Selective, SHA256-verified plugin installation for AWS, Azure, and HashiCorp Vault.",
    icon: Lock
  },
  {
    title: "Unified Diagnostics",
    description: "Built-in 'system doctor' to verify binary integrity and plugin connectivity.",
    icon: Cpu
  },
  {
    title: "Smart Checksum Rotation",
    description: "Disruption-free rotation. Triggers only when secret payload actually changes.",
    icon: RefreshCw
  }
];

export const FeaturesBento = () => {
  return (
    <section id="features" className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-outfit">
            Enterprise-grade by design.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Architected for security teams who need high-assurance secret orchestration without the overhead of Kubernetes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-accent/40 shadow-[0_0_15px_rgba(0,230,192,0.1)] transition-all">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-outfit">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
