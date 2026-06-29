"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Cloud, Key, Globe, HardDrive } from "lucide-react";

const PROVIDERS = [
  {
    icon: Lock,
    name: "HashiCorp Vault",
    desc: "Self-hosted or HCP Vault with full TLS and audit trail support.",
    badges: ["Rotation", "Injection", "Audit", "TLS"],
    href: "/deploy#vault",
    featured: false,
  },
  {
    icon: Cloud,
    name: "AWS Secrets Manager",
    desc: "Native AWS integration with IAM-based access and automatic versioning.",
    badges: ["Rotation", "Injection", "IAM"],
    href: "/deploy#aws",
    featured: false,
  },
  {
    icon: Key,
    name: "Azure Key Vault",
    desc: "Microsoft Azure managed secret storage with Azure AD RBAC.",
    badges: ["Rotation", "Injection", "RBAC"],
    href: "/deploy#azure",
    featured: false,
  },
  {
    icon: Globe,
    name: "Huawei Cloud CSMS",
    desc: "Cloud Secret Management Service for Huawei Cloud workloads.",
    badges: ["Rotation", "Injection", "Audit"],
    href: "/deploy#huawei",
    featured: true,
  },
  {
    icon: HardDrive,
    name: "Local Vault",
    desc: "Encrypted local store for dev and air-gapped environments. No cloud needed.",
    badges: ["Injection", "Offline", "Dev"],
    href: "/deploy#local",
    featured: false,
  },
];

export const ProviderEcosystem = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(109,93,246,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
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
            Integrations
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            Works with your
            <br />
            <span style={{ color: "#00E6C0" }}>secret provider</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Swap providers without changing application code.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROVIDERS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.a
                key={idx}
                href={p.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="block p-6 rounded-2xl transition-all duration-300 group no-underline"
                style={{
                  background: p.featured
                    ? "rgba(0,230,192,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: p.featured
                    ? "1px solid rgba(0,230,192,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(0,230,192,0.4)";
                  el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = p.featured
                    ? "rgba(0,230,192,0.25)"
                    : "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(0,230,192,0.1)",
                      border: "1px solid rgba(0,230,192,0.2)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "#F8FAFC" }}
                    >
                      {p.name}
                    </h3>
                    {p.featured && (
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider"
                        style={{ color: "#00E6C0" }}
                      >
                        New
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "#94A3B8" }}
                >
                  {p.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: "rgba(0,230,192,0.08)",
                        border: "1px solid rgba(0,230,192,0.15)",
                        color: "#00E6C0",
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
