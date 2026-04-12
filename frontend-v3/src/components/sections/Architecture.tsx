"use client";

import React from "react";
import { motion } from "framer-motion";

/* ─────────────────────── Node data ─────────────────────── */
const providers = [
  { label: "AWS Secrets Manager", color: "#f97316", auth: "IAM / OAuth2" },
  { label: "HashiCorp Vault",     color: "#a78bfa", auth: "AppRole / Token" },
  { label: "Azure Key Vault",     color: "#38bdf8", auth: "Managed ID" },
  { label: "Local Filesystem",    color: "#94a3b8", auth: "POSIX" },
];

const containers = [
  { label: "api-service",   port: "/run/secrets/API_KEY",    type: "Env Map" },
  { label: "db-worker",     port: "/run/secrets/DB_PASS",    type: "File Sync" },
  { label: "web-frontend",  port: "/run/secrets/JWT_SECRET", type: "Env Map" },
];

/* ─────────────────────── Sub-components ─────────────────── */
const Pill = ({
  label,
  auth,
  accent,
  className = "",
  delay = 0,
}: {
  label: string;
  auth: string;
  accent: string;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay }}
    className={`flex flex-col gap-0.5 px-4 py-2.5 rounded-lg border bg-[#0d1117] relative group ${className}`}
    style={{ borderColor: `${accent}33` }}
  >
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full shrink-0 animate-pulse"
        style={{ backgroundColor: accent }}
      />
      <span className="text-sm font-mono font-medium text-gray-200">{label}</span>
    </div>
    <span className="text-[9px] font-mono text-gray-500 pl-4 uppercase tracking-tighter">{auth}</span>
  </motion.div>
);

const ContainerPill = ({
  label,
  port,
  type,
  delay = 0,
}: {
  label: string;
  port: string;
  type: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay }}
    className="flex flex-col px-4 py-2.5 rounded-lg border border-blue-500/25 bg-[#0d1117] relative"
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-mono font-semibold text-gray-200">{label}</span>
      <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1 border border-blue-500/20 rounded uppercase">{type}</span>
    </div>
    <span className="text-[10px] font-mono text-gray-500 mt-1">{port}</span>
  </motion.div>
);

/* ─────────────────────── SVG connector lines ─────────────── */
const AnimatedDashedLine = ({
  id, x1, y1, x2, y2, color = "#00e6c0", delay = 0, label = "", reverse = false
}: {
  id: string; x1: number; y1: number; x2: number; y2: number;
  color?: string; delay?: number; label?: string; reverse?: boolean;
}) => {
  const mid = (x1 + x2) / 2;
  const d = `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
  
  return (
    <g>
      {/* Background static line */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.15}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay }}
      />

      {/* Animated Flowing Particles */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="4 20"
        strokeOpacity={0.6}
        initial={{ strokeDashoffset: reverse ? -48 : 48, opacity: 0 }}
        animate={{ strokeDashoffset: reverse ? 48 : -48, opacity: 1 }}
        transition={{
          strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.5, delay }
        }}
      />

      {/* Hover Information Label (Invisible by default, appears on path hover) */}
      {label && (
        <text
          x={mid}
          y={y2 - 10}
          fill={color}
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle"
          className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

/* ─────────────────────── Main Section ───────────────────── */
export const Architecture = () => {
  const providerY = [70, 130, 190, 250];
  const containerY = [100, 180, 260];
  const agentY = 170;

  return (
    <section id="architecture" className="section-gap border-b border-border overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            System Architecture
          </h2>
          <p className="prose-block mx-auto text-gray-400 text-lg">
            A deterministic pipeline for secret synchronization. Decrypted payloads are 
            atomic streamed into memory-backed filesystems.
          </p>
        </motion.div>

        {/* Node Graph Wrapper */}
        <div className="relative w-full max-w-5xl mx-auto group">
          {/* Visual indicators for flow direction */}
          <div className="absolute top-0 left-[20%] text-[9px] font-mono text-accent/30 tracking-[0.3em] uppercase hidden md:block">
            Secure Retrieval
          </div>
          <div className="absolute top-0 right-[20%] text-[9px] font-mono text-accent/30 tracking-[0.3em] uppercase hidden md:block">
            In-Memory Injection
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[400px]">

            {/* ── Left: Providers ── */}
            <div className="flex flex-col gap-4 z-10 w-full lg:w-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                Source Backends
              </div>
              {providers.map((p, i) => (
                <Pill
                  key={p.label}
                  label={p.label}
                  auth={p.auth}
                  accent={p.color}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* ── Center: SVG Canvas + Agent ── */}
            <div className="flex-1 relative flex items-center justify-center min-w-0 h-[340px] w-full lg:w-auto">
              {/* SVG Canvas */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 340"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Left side flows: Providers -> Agent */}
                {providerY.map((py, i) => (
                  <AnimatedDashedLine
                    key={`in-${i}`}
                    id={`in-${i}`}
                    x1={0} y1={py}
                    x2={250} y2={agentY}
                    color={providers[i].color}
                    delay={0.2 + i * 0.1}
                    label="Encrypted"
                  />
                ))}

                {/* Right side flows: Agent -> Containers */}
                {containerY.map((cy, i) => (
                  <AnimatedDashedLine
                    key={`out-${i}`}
                    id={`out-${i}`}
                    x1={250} y1={agentY}
                    x2={500} y2={cy}
                    color="#00e6c0"
                    delay={0.6 + i * 0.1}
                    label="Streaming"
                  />
                ))}
              </svg>

              {/* DSO Agent Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative z-10"
              >
                <div className="relative p-7 rounded-2xl border border-accent/40 bg-[#0d1117] shadow-[0_0_60px_rgba(0,230,192,0.1)] text-center min-w-[170px]">
                  {/* Internal Glow Pulse */}
                  <motion.div 
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-accent rounded-2xl pointer-events-none"
                  />
                  
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60 mb-2 relative z-10">
                    Agent Core
                  </div>
                  <div className="text-3xl font-black text-white mb-1 tracking-tighter relative z-10">DSO</div>
                  <div className="text-[10px] text-accent font-mono relative z-10 flex items-center justify-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
                    RUNNING
                  </div>
                  
                  {/* Metric-like indicators */}
                  <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-accent/10 relative z-10">
                    <div className="flex justify-between text-[8px] font-mono text-gray-500">
                      <span>STREAMS</span>
                      <span className="text-accent">ACTIVE</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-gray-500">
                      <span>LATENCY</span>
                      <span className="text-accent">~1.2ms</span>
                    </div>
                  </div>
                </div>

                {/* Orbital Rings - Kong inspired */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border border-accent/5 rounded-full pointer-events-none"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-40px] border border-accent/5 rounded-full border-dashed pointer-events-none"
                />
              </motion.div>
            </div>

            {/* ── Right: Containers ── */}
            <div className="flex flex-col gap-4 z-10 w-full lg:w-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Target Runtimes
              </div>
              {containers.map((c, i) => (
                <ContainerPill key={c.label} {...c} delay={0.7 + i * 0.1} />
              ))}
              <div className="mt-1 text-[10px] font-mono text-accent/50 bg-accent/5 py-1 px-3 rounded-full border border-accent/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                tmpfs /run/secrets MOUNTED
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            {
              title: "Native Lifecycle",
              desc: "Hooks into Docker's event stream. No custom entrypoints or sidecar proxies required.",
              tags: ["gRPC", "Protobuf"]
            },
            {
              title: "Transparent Rotation",
              desc: "Monitors upstream provider checksums. Rotates target filesystems without process restarts.",
              tags: ["SHA-256", "In-Memory"]
            },
            {
              title: "Zero-Persistence",
              desc: "Secrets are only ever written to RAM-backed 'tmpfs' volumes. No trace left on host disk.",
              tags: ["RAMfs", "Unix IPC"]
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-surface/30 border border-border/50 hover:border-accent/40 transition-all duration-300 relative group"
            >
              <div className="flex gap-1.5 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-gray-500 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-base font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
