"use client";

import React from "react";
import { motion } from "framer-motion";
import { HardDrive, Clock, Trash2, Lock, UserCheck, ShieldCheck } from "lucide-react";

const GUARANTEES = [
  {
    icon: HardDrive,
    title: "Zero disk persistence",
    desc: "Nothing written to disk, files, or databases. Secrets exist only in container memory.",
  },
  {
    icon: Clock,
    title: "Runtime-only injection",
    desc: "Credentials fetched from your provider at container start. DSO is a conduit, not a store.",
  },
  {
    icon: Trash2,
    title: "Automatic cleanup",
    desc: "On container stop or rotation, in-memory secrets are purged immediately.",
  },
  {
    icon: Lock,
    title: "Encrypted in transit",
    desc: "All provider communication uses TLS with certificate verification. No plaintext secrets.",
  },
  {
    icon: UserCheck,
    title: "Least privilege",
    desc: "DSO requests only the secrets it needs, with minimum required permissions per provider IAM.",
  },
  {
    icon: ShieldCheck,
    title: "Rollback on failure",
    desc: "If a new container fails health checks, DSO rolls back automatically to the last known good state.",
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
            Hard architectural constraints — not aspirations.
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
                transition={{ delay: idx * 0.07 }}
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(0,230,192,0.1)",
                    border: "1px solid rgba(0,230,192,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                </div>
                <h3
                  className="font-semibold text-sm mb-2"
                  style={{ color: "#F8FAFC" }}
                >
                  {g.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
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
