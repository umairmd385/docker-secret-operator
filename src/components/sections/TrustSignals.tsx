"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, HardDrive, Lock, Activity } from "lucide-react";

const signals = [
  { icon: Lock, title: "AES-256 Encryption", desc: "Native vault & transit" },
  { icon: HardDrive, title: "Zero Disk Persistence", desc: "RAM-only injection" },
  { icon: Shield, title: "Verified Plugins", desc: "SHA256 integrity checks" },
  { icon: Activity, title: "System Doctor", desc: "Unified diagnostics" },
];

export const TrustSignals = () => {
  return (
    <section className="py-20 border-y border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {signals.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-accent" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">{s.title}</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
