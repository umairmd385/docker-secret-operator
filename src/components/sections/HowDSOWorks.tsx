"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Database, Cpu, Package, Server } from "lucide-react";

const NODES = [
  { icon: User, label: "Developer", sub: "Triggers rotation" },
  { icon: Database, label: "Secret Provider", sub: "AWS / Vault / Azure / Huawei" },
  { icon: Cpu, label: "DSO Engine", sub: "Orchestrates zero-downtime swap", accent: true },
  { icon: Package, label: "Docker Compose", sub: "Container lifecycle" },
  { icon: Server, label: "Running Containers", sub: "Seamlessly updated" },
];

const FlowNode = ({
  icon: Icon,
  label,
  sub,
  accent,
  delay,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  sub: string;
  accent?: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="flex flex-col items-center text-center"
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 relative"
      style={{
        background: accent
          ? "rgba(0,230,192,0.12)"
          : "rgba(255,255,255,0.04)",
        border: accent
          ? "1px solid rgba(0,230,192,0.35)"
          : "1px solid rgba(255,255,255,0.1)",
        boxShadow: accent ? "0 0 30px rgba(0,230,192,0.15)" : undefined,
      }}
    >
      <Icon
        className="w-7 h-7"
        style={{ color: accent ? "#00E6C0" : "#94A3B8" }}
      />
    </div>
    <p
      className="font-semibold text-sm"
      style={{ color: accent ? "#00E6C0" : "#F8FAFC" }}
    >
      {label}
    </p>
    <p className="text-xs mt-0.5 max-w-[100px]" style={{ color: "#94A3B8" }}>
      {sub}
    </p>
  </motion.div>
);

const Connector = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.35 }}
    className="flex flex-col items-center gap-1"
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0] }}
        viewport={{ once: true }}
        transition={{
          delay: delay + i * 0.2,
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 1.2,
        }}
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#00E6C0" }}
      />
    ))}
  </motion.div>
);

export const HowDSOWorks = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
            Architecture
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            How DSO works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            An event-driven engine between your secret provider and containers — credentials rotate without touching traffic.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-center justify-center gap-0">
          {NODES.map((node, idx) => (
            <React.Fragment key={idx}>
              <FlowNode {...node} delay={idx * 0.12} />
              {idx < NODES.length - 1 && (
                <div className="flex items-center gap-1 px-3 flex-shrink-0">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: [0, 1, 0] }}
                      viewport={{ once: true }}
                      transition={{
                        delay: idx * 0.15 + i * 0.15,
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1.8,
                      }}
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#00E6C0" }}
                    />
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="md:hidden flex flex-col items-center gap-0">
          {NODES.map((node, idx) => (
            <React.Fragment key={idx}>
              <FlowNode {...node} delay={idx * 0.12} />
              {idx < NODES.length - 1 && (
                <Connector delay={idx * 0.15 + 0.3} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
