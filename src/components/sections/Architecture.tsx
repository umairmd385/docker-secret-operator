"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { motion } from "framer-motion";

/* ─────────────────────── Node data ─────────────────────── */
const providers = [
  { 
    label: "AWS Secrets Manager", 
    color: "#FF9900", 
    auth: "IAM / OAuth2",
    logo: "https://cdn.simpleicons.org/amazonaws" 
  },
  { 
    label: "HashiCorp Vault",     
    color: "#FF0000", 
    auth: "AppRole / Token",
    logo: "https://cdn.simpleicons.org/hashicorpvault"
  },
  { 
    label: "Azure Key Vault",     
    color: "#008AD7", 
    auth: "Managed ID",
    logo: "https://cdn.simpleicons.org/microsoftazure"
  },
  { 
    label: "Huawei CSMS",         
    color: "#FF0000", 
    auth: "ECS Agency",
    logo: "https://cdn.simpleicons.org/huawei"
  },
  { 
    label: "Local Filesystem",    
    color: "#FCC624", 
    auth: "POSIX",
    logo: "https://cdn.simpleicons.org/linux"
  },
];

const containers = [
  { label: "api-service",   port: "/run/secrets/API_KEY",    type: "Env Map" },
  { label: "db-worker",     port: "/run/secrets/DB_PASS",    type: "File Sync" },
  { label: "web-frontend",  port: "/run/secrets/JWT_SECRET", type: "Env Map" },
];

/* ─────────────────────── Sub-components ─────────────────── */
const Pill = React.forwardRef<HTMLDivElement, {
  label: string;
  auth: string;
  accent: string;
  logo?: string;
  className?: string;
  delay?: number;
}>(({ label, auth, accent, logo, className = "", delay = 0 }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay }}
    whileHover={{ y: -2, borderColor: `${accent}44` }}
    className={`flex flex-col gap-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-[#0d1117]/80 backdrop-blur-sm relative group cursor-default transition-colors ${className}`}
    style={{ borderColor: `${accent}22` }}
  >
    <div className="flex items-center gap-2.5">
      {logo ? (
        <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 flex items-center justify-center relative">
          <img src={logo} alt={label} className="w-full h-full object-contain relative z-10" />
          <div className="absolute inset-0 blur-md opacity-20 scale-150" style={{ backgroundColor: accent }} />
        </div>
      ) : (
        <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}66` }}
        />
      )}
      <span className="text-[10px] sm:text-sm font-mono font-medium text-gray-200 tracking-tight">{label}</span>
    </div>
    <span className="text-[7px] sm:text-[9px] font-mono text-gray-500 pl-[30px] sm:pl-[34px] uppercase tracking-widest">{auth}</span>
  </motion.div>
));
Pill.displayName = "Pill";

const ContainerPill = React.forwardRef<HTMLDivElement, {
  label: string;
  port: string;
  type: string;
  delay?: number;
  className?: string;
}>(({ label, port, type, delay = 0, className = "" }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay }}
    whileHover={{ y: -2, borderColor: "rgba(59, 130, 246, 0.4)" }}
    className={`flex flex-col px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-blue-500/10 bg-[#0d1117]/80 backdrop-blur-sm relative cursor-default transition-colors ${className}`}
  >
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] sm:text-sm font-mono font-semibold text-gray-200 tracking-tight">{label}</span>
      <span className="text-[7px] sm:text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded-md uppercase shrink-0 font-bold">{type}</span>
    </div>
    <span className="text-[8px] sm:text-[10px] font-mono text-gray-500 mt-1 truncate opacity-70">{port}</span>
  </motion.div>
));
ContainerPill.displayName = "ContainerPill";

/* ─────────────────────── SVG connector lines ─────────────── */
const AnimatedDashedLine = ({
  x1, y1, x2, y2, color = "#00e6c0", delay = 0, reverse = false
}: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; delay?: number; reverse?: boolean;
}) => {
  const midY = (y1 + y2) / 2;
  const d = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.08}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeDasharray="4 16"
        strokeOpacity={0.3}
        initial={{ strokeDashoffset: reverse ? -40 : 40, opacity: 0 }}
        animate={{ strokeDashoffset: reverse ? 40 : -40, opacity: 1 }}
        transition={{
          strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.8, delay }
        }}
      />
    </g>
  );
};

/* ─────────────────────── Main Section ───────────────────── */
export const Architecture = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    providers: { x: number; y: number }[];
    containers: { x: number; y: number }[];
    agent: { x: number; y: number; width: number; height: number };
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const providerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const agentRef = useRef<HTMLDivElement>(null);

  const updateCoords = useCallback(() => {
    if (!svgRef.current || !agentRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const agentRect = agentRef.current.getBoundingClientRect();

    const getCenter = (el: HTMLElement | null, type: 'top' | 'bottom') => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - svgRect.left,
        y: type === 'top' ? rect.top - svgRect.top : rect.bottom - svgRect.top
      };
    };

    const newCoords = {
      providers: providerRefs.current.map(ref => getCenter(ref, 'bottom')),
      containers: containerRefs.current.map(ref => getCenter(ref, 'top')),
      agent: {
        x: agentRect.left + agentRect.width / 2 - svgRect.left,
        y: agentRect.top + agentRect.height / 2 - svgRect.top,
        width: agentRect.width,
        height: agentRect.height
      }
    };

    setCoords(newCoords);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport();

    const observer = new ResizeObserver(() => {
      updateCoords();
      checkViewport();
    });

    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", updateCoords);
    
    const timer = setTimeout(updateCoords, 150);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCoords);
      clearTimeout(timer);
    };
  }, [mounted, updateCoords]);

  return (
    <section id="architecture" className="section-gap border-b border-border overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-24"
        >
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 font-outfit">
            System Architecture
          </h2>
          <p className="prose-block mx-auto text-gray-400 text-base sm:text-lg">
            A deterministic pipeline for secret synchronization. Decrypted payloads are 
            atomic streamed into memory-backed filesystems.
          </p>
        </motion.div>

        {/* Node Graph Wrapper */}
        <div ref={containerRef} className="relative w-full max-w-5xl mx-auto">
          
          {/* SVG Canvas */}
          {mounted && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              aria-hidden="true"
            >
              {coords && (
                <>
                  {/* Input Lines */}
                  {coords.providers.map((pCoord, i) => (
                    <AnimatedDashedLine
                      key={`in-${i}`}
                      x1={pCoord.x} y1={pCoord.y}
                      x2={coords.agent.x} y2={coords.agent.y - coords.agent.height / 2}
                      color={providers[i].color}
                      delay={0.2 + i * 0.05}
                    />
                  ))}
                  {/* Output Lines */}
                  {coords.containers.map((cCoord, i) => (
                    <AnimatedDashedLine
                      key={`out-${i}`}
                      x1={coords.agent.x} y1={coords.agent.y + coords.agent.height / 2}
                      x2={cCoord.x} y2={cCoord.y}
                      color="#00e6c0"
                      delay={0.6 + i * 0.05}
                    />
                  ))}
                </>
              )}
            </svg>
          )}

          <div className="relative flex flex-col items-center gap-12 sm:gap-20 lg:gap-24">

            {/* ── Providers ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row justify-center gap-3 sm:gap-6 z-20 w-full lg:w-auto">
              {providers.map((p, i) => (
                <Pill
                  key={p.label}
                  ref={el => { providerRefs.current[i] = el; }}
                  label={isMobile && p.label.split(' ')[0] ? p.label.split(' ')[0] : p.label}
                  auth={p.auth}
                  accent={p.color}
                  logo={p.logo}
                  delay={i * 0.05}
                  className="min-w-[100px] sm:min-w-[150px]"
                />
              ))}
            </div>

            {/* ── Center: Agent Core ── */}
            <div className="relative flex items-center justify-center w-full min-h-[160px] sm:min-h-[250px]">
              {/* DSO Agent Node */}
              <motion.div
                ref={agentRef}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative z-10"
              >
                <div className="relative p-6 sm:p-10 rounded-3xl border border-accent/30 bg-[#0d1117] shadow-[0_0_80px_rgba(0,230,192,0.15)] text-center min-w-[160px] sm:min-w-[220px]">
                  <motion.div 
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-accent rounded-3xl pointer-events-none"
                  />
                  
                  <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60 mb-3 relative z-10 font-mono">
                    Agent Core
                  </div>
                  <div className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tighter relative z-10 font-outfit">DSO</div>
                  <div className="text-[10px] sm:text-[12px] text-accent font-mono relative z-10 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    RUNNING
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-5 sm:mt-8 pt-5 sm:pt-8 border-t border-accent/10 relative z-10 text-[9px] sm:text-[11px] font-mono text-gray-400">
                    <div className="flex justify-between">
                      <span className="opacity-60 uppercase tracking-tighter">Streams</span>
                      <span className="text-accent font-bold italic">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60 uppercase tracking-tighter">Latency</span>
                      <span className="text-accent underline decoration-accent/20">1.2ms</span>
                    </div>
                  </div>
                </div>

                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-25px] sm:inset-[-40px] border border-accent/5 rounded-full pointer-events-none"
                />
              </motion.div>
            </div>

            {/* ── Containers ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 z-20 w-full lg:w-auto">
              {containers.map((c, i) => (
                <ContainerPill 
                  key={c.label} 
                  ref={el => { containerRefs.current[i] = el; }}
                  {...c} 
                  delay={0.7 + i * 0.05} 
                  className="w-full lg:min-w-[200px]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-24 sm:mt-40">
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
              className="p-8 sm:p-10 rounded-3xl bg-surface/20 border border-border/40 hover:border-accent/30 transition-all duration-500 relative group overflow-hidden"
            >
              <div className="flex gap-2 mb-6">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-1 rounded-lg bg-surface border border-border text-gray-500 group-hover:text-accent group-hover:border-accent/20 transition-all duration-300">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight font-outfit">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium opacity-80">{item.desc}</p>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
