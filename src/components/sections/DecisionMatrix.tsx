"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const DecisionMatrix = () => {
  const criteria = [
    { text: "Docker Compose environments", match: true },
    { text: "Local developer machines", match: true },
    { text: "Multi-cloud secret integration (AWS, Azure, Vault)", match: true },
    { text: "Event-driven infrastructure", match: true },
    { text: "Teams avoiding Kubernetes complexity", match: true },
    { text: "Full Kubernetes clusters deploying Pods", match: false, note: "Use external-secrets operator instead" },
    { text: "Serverless (AWS Lambda / Cloudflare Workers)", match: false, note: "Use native cloud integrations" }
  ];

  return (
    <section className="py-24 border-t border-border relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            When should you use DSO?
          </h2>
          <p className="text-sm font-mono text-accent/70 tracking-wide mb-4">
            Built for Docker, not Kubernetes.
          </p>
          <p className="text-gray-400 text-lg">
            DSO is purpose-built for Docker — not Kubernetes.
          </p>
        </motion.div>

        <Card className="p-8 md:p-12 shadow-2xl bg-[#0a0f16]/80 border-accent/20">
          <ul className="space-y-6">
            {criteria.map((item, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.match ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {item.match ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-lg text-gray-200">
                    {item.text}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-500 mt-1 font-mono">→ {item.note}</p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
};
