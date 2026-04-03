'use client';

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Shield, Zap, Globe, Cpu, RefreshCw, Lock } from "lucide-react";

const features = [
  {
    name: "Multi-Cloud Sync",
    description: "Native connectors for AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, and more. Sync all secrets to one standard.",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Zero-Downtime Rotation",
    description: "Rotate secrets at the source. DSO detects the change and updates the container in real-time. No restarts required.",
    icon: RefreshCw,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Memory-Only Storage",
    description: "Secrets never touch the disk. They are held in process memory and injected via secure Unix socket.",
    icon: Lock,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Native Docker Plugin",
    description: "A first-class Docker CLI plugin. No custom binaries to manage. Just 'docker dso' straight from your terminal.",
    icon: Cpu,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "Enterprise Audit Logs",
    description: "Detailed JSON audit trails for every fetch and injection. SOC2-ready observability from day one.",
    icon: Shield,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "High Performance",
    description: "Written in Go. Uses < 20MB of RAM. Built to handle 10,000+ secret updates per second.",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent-dim",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-bg-secondary border-y border-border-soft">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-4"
          >
            Built for production security.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            DSO provides the bridge between your secure cloud secret managers and your running containers.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-surface border border-border-primary rounded-3xl hover:border-accent/40 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {feature.name}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
