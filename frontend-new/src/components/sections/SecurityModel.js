'use client';

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Shield, Lock, Eye, Zap, Key } from "lucide-react";

const securityFeatures = [
  {
    title: "Memory-Only Store",
    description: "Secrets are held in the agent's in-process RAM. Never written to the filesystem. Purged on shutdown.",
    icon: Lock,
  },
  {
    title: "Unix Socket Transport",
    description: "CLI↔Agent communication happens over a local Unix socket. No network exposure, no TLS to manage.",
    icon: Zap,
  },
  {
    title: "IAM Role Auth",
    description: "DSO uses EC2 Instance Profiles, Managed Identity, and Vault AppRole. No static keys stored on the host.",
    icon: Key,
  },
  {
    title: "Structured Audit Logs",
    description: "Every fetch, rotation, and strategy decision is logged in JSON. SOC2-compliant observability.",
    icon: Eye,
  },
];

export function SecurityModel() {
  return (
    <section id="security" className="py-24 bg-bg-primary">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-4"
          >
            Built for trust, not just compliance.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            Every design decision in DSO is a security decision. Here&apos;s exactly what happens with your secrets.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 p-6 bg-surface border border-border-primary rounded-3xl hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-[2.5rem] p-10 lg:p-12">
            <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-accent" />
              Threat Model Mitigation
            </h3>
            <div className="space-y-6">
               {[
                 { q: "Dev commits .env to GitHub", a: "No .env files needed" },
                 { q: "Secrets visible on laptops", a: "Never stored on disk" },
                 { q: "Compromised machine", a: "No static credentials held on host" },
                 { q: "Network interception", a: "Unix socket only, no exposed port" }
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                     <span className="text-accent text-[10px] font-bold">✓</span>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-text-primary mb-1">{item.q}</p>
                     <p className="text-xs text-text-muted">{item.a}</p>
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-12 p-6 bg-surface/50 border border-border-soft rounded-2xl">
               <p className="text-xs text-text-muted leading-relaxed italic">
                 &ldquo;DSO bridges the gap between high-security cloud isolation and native Docker performance.&rdquo;
               </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
