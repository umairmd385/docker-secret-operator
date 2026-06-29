"use client";

import React from "react";
import { motion } from "framer-motion";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhyDSO } from "@/components/sections/WhyDSO";
import {
  Database,
  Key,
  Shield,
  Zap,
  RefreshCw,
  Cloud,
  Container,
  FileCheck,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

const USE_CASES = [
  {
    icon: Database,
    title: "Database Credentials",
    description: "Rotate DB passwords without dropping connections. Containers reconnect automatically.",
    example: "PostgreSQL, MySQL, MongoDB",
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Rotate API keys automatically. Services pick up fresh credentials on the next request.",
    example: "Third-party APIs, internal services",
  },
  {
    icon: Shield,
    title: "TLS Certificates",
    description: "Update certificates before expiration. Traffic continues uninterrupted.",
    example: "Mutual TLS, self-signed certs",
  },
];

const CAPABILITIES = [
  {
    icon: Zap,
    title: "Zero-Downtime Rotation",
    description: "Secrets rotate without interrupting services or dropping connections.",
  },
  {
    icon: RefreshCw,
    title: "Automatic Recovery",
    description: "Checkpoint-based recovery after crashes or failed health checks. No ops required.",
  },
  {
    icon: Cloud,
    title: "5 Providers",
    description: "AWS, Azure, HashiCorp Vault, Huawei Cloud CSMS, and local encrypted vault.",
  },
  {
    icon: Container,
    title: "Docker Native",
    description: "Built for Docker Compose and standalone hosts. No Kubernetes, no orchestrator.",
  },
  {
    icon: Shield,
    title: "~50 MB RAM",
    description: "Lightweight footprint. Under 5% CPU during rotation. Negligible production impact.",
  },
  {
    icon: FileCheck,
    title: "Free & Open Source",
    description: "Fully auditable on GitHub. No lock-in, no proprietary extensions.",
  },
];

const CHOOSE_DSO = [
  "You run Docker Compose or standalone Docker hosts",
  "You want fully automated rotation without ops overhead",
  "You need zero-downtime guarantees",
  "You prefer simple, focused tools over platforms",
  "Your team knows Docker but not Vault or Infisical",
];

const CHOOSE_ALT = [
  "You run Kubernetes (use native solutions instead)",
  "You need a complete secret management platform",
  "You require team-based access controls",
  "You need audit compliance (SOC2, ISO, etc.)",
  "You want a managed SaaS offering",
];

const NEXT = [
  {
    title: "Architecture",
    description:
      "How atomic swap, health checks, and checkpoint recovery work under the hood.",
    href: "/architecture",
  },
  {
    title: "Deploy",
    description:
      "Install DSO on Docker Compose, AWS, Azure, HashiCorp Vault, or local mode.",
    href: "/deploy",
  },
  {
    title: "Docs",
    description: "CLI reference, configuration, operational guides, and troubleshooting.",
    href: "/docs",
  },
];

export default function ProductPage() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "600px",
            height: "500px",
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="pt-36 pb-24 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-5"
              style={{ color: "#94A3B8" }}
            >
              Product
            </p>
            <h1
              className="font-bold tracking-tighter mb-6"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "#F8FAFC",
                lineHeight: "1.05",
              }}
            >
              Secret rotation
              <br />
              <span style={{ color: "#00E6C0" }}>without downtime</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "#94A3B8" }}
            >
              A focused runtime engine for Docker teams. Automates credential rotation so you don&apos;t have to.
            </p>
          </motion.div>
        </section>

        {/* Use Cases */}
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#94A3B8" }}
              >
                Use Cases
              </p>
              <h2
                className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4"
                style={{ color: "#F8FAFC" }}
              >
                What DSO handles
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
                Any credential that needs zero-downtime rotation in Docker workloads.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {USE_CASES.map((uc, idx) => {
                const Icon = uc.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.15 } }}
                    className="p-7 rounded-2xl cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(0,230,192,0.3)";
                      el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: "rgba(0,230,192,0.1)",
                        border: "1px solid rgba(0,230,192,0.2)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                    </div>
                    <h3
                      className="font-semibold text-lg mb-3"
                      style={{ color: "#F8FAFC" }}
                    >
                      {uc.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: "#94A3B8" }}
                    >
                      {uc.description}
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: "rgba(0,230,192,0.6)" }}
                    >
                      {uc.example}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section
          className="py-20 sm:py-28"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#94A3B8" }}
              >
                Capabilities
              </p>
              <h2
                className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4"
                style={{ color: "#F8FAFC" }}
              >
                Core capabilities
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
                Operational guarantees backed by architectural constraints.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAPABILITIES.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: "rgba(0,230,192,0.03)",
                      border: "1px solid rgba(0,230,192,0.12)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(0,230,192,0.1)",
                          border: "1px solid rgba(0,230,192,0.2)",
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "#00E6C0" }} />
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-sm mb-1.5"
                          style={{ color: "#F8FAFC" }}
                        >
                          {cap.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#94A3B8" }}
                        >
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <a
                href="/architecture"
                className="text-sm font-medium transition-colors"
                style={{ color: "#00E6C0" }}
              >
                How these guarantees are implemented →
              </a>
            </div>
          </div>
        </section>

        {/* Why DSO comparison */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <WhyDSO />
        </section>

        {/* Honest Tradeoffs */}
        <section
          className="py-20 sm:py-28"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#94A3B8" }}
              >
                Fit
              </p>
              <h2
                className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4"
                style={{ color: "#F8FAFC" }}
              >
                Honest tradeoffs
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
                DSO is the right choice for some teams. Not for all. Be honest about fit.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Choose DSO */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl space-y-5"
                style={{
                  background: "rgba(0,230,192,0.04)",
                  border: "1px solid rgba(0,230,192,0.2)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5" style={{ color: "#00E6C0" }} />
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#F8FAFC" }}
                  >
                    Choose DSO if
                  </h3>
                </div>
                <ul className="space-y-3">
                  {CHOOSE_DSO.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-sm"
                      style={{ color: "#94A3B8" }}
                    >
                      <span
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: "#00E6C0" }}
                      >
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Consider alternatives */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl space-y-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5" style={{ color: "#94A3B8" }} />
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#F8FAFC" }}
                  >
                    Consider alternatives if
                  </h3>
                </div>
                <ul className="space-y-3">
                  {CHOOSE_ALT.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-sm"
                      style={{ color: "#94A3B8" }}
                    >
                      <span className="flex-shrink-0 mt-0.5" style={{ color: "#6B7280" }}>
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section
          className="py-20 sm:py-28"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4"
                style={{ color: "#F8FAFC" }}
              >
                Ready to get started?
              </h2>
              <p className="text-lg" style={{ color: "#94A3B8" }}>
                Understand how DSO works, deploy it, or read the docs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {NEXT.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className="p-7 rounded-2xl text-left block no-underline group transition-all duration-300"
                  style={{
                    background: "rgba(0,230,192,0.04)",
                    border: "1px solid rgba(0,230,192,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(0,230,192,0.4)";
                    el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(0,230,192,0.15)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "#F8FAFC" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "#94A3B8" }}
                  >
                    {item.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: "#00E6C0" }}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
