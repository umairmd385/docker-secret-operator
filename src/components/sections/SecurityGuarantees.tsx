"use client";

import React from "react";
import { motion } from "framer-motion";
import { HardDrive, Clock, Trash2, Lock, UserCheck } from "lucide-react";

const GUARANTEES = [
  {
    icon: HardDrive,
    title: "Secrets never stored permanently",
    desc: "DSO is a runtime-only injection engine. Nothing is written to disk, files, or databases. Secrets exist only in memory during container runtime.",
  },
  {
    icon: Clock,
    title: "Runtime-only injection",
    desc: "Credentials are injected at container start from your secret provider. The source is always your provider — DSO is just the conduit.",
  },
  {
    icon: Trash2,
    title: "Automatic cleanup",
    desc: "On container stop or rotation, all in-memory secrets are purged immediately. No lingering credentials in stopped containers.",
  },
  {
    icon: Lock,
    title: "Encrypted communication",
    desc: "All communication between DSO and secret providers uses TLS with certificate verification. No plaintext secret transmission.",
  },
  {
    icon: UserCheck,
    title: "Least privilege",
    desc: "DSO requests only the specific secrets it needs, with the minimum permissions required. Provider IAM policies are respected.",
  },
];

export const SecurityGuarantees = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "#94A3B8" }}
          >
            Security
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            Security guarantees
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            DSO was designed from the ground up with a security-first model.
            These are not aspirations — they are hard architectural constraints.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUARANTEES.map((g, idx) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="p-6 rounded-2xl cursor-default transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(0,230,192,0.3)";
                  el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.07)";
                  el.style.background = "rgba(0,230,192,0.04)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                  el.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(0,230,192,0.1)",
                    border: "1px solid rgba(0,230,192,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "#F8FAFC" }}
                >
                  {g.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#94A3B8" }}
                >
                  {g.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
