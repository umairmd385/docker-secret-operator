"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { ROUTES } from "@/lib/links";

const TERMINAL_COMMANDS = [
  {
    cmd: "docker dso init",
    output: [
      "✓ DSO configuration created",
      "✓ Secret provider detected: aws-secrets-manager",
      "✓ Ready to start",
    ],
  },
  {
    cmd: "docker dso up",
    output: [
      "✓ DSO engine started",
      "✓ Watching 3 secret paths",
      "✓ Health checks: PASSED",
    ],
  },
  {
    cmd: "docker dso rotate postgres-password",
    output: [
      "  Fetching secret from provider...",
      "✓ Secret fetched",
      "✓ New container staged",
      "✓ Health verified (1.8s)",
      "✓ Traffic swapped — 0 requests failed",
    ],
  },
  {
    cmd: "docker dso inspect",
    output: [
      "  Status:        running",
      "  Provider:      aws-secrets-manager",
      "  Last rotation: 2 seconds ago",
      "  Uptime:        47 days",
    ],
  },
];

const CHAR_DELAY = 38;
const LINE_DELAY = 180;
const CMD_PAUSE = 1400;

const AnimatedTerminal = ({ prefersReduced }: { prefersReduced: boolean }) => {
  const [cmdIdx, setCmdIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");

  const cmd = TERMINAL_COMMANDS[cmdIdx];

  useEffect(() => {
    if (prefersReduced) {
      setTypedChars(cmd.cmd.length);
      setVisibleLines(cmd.output.length);
      return;
    }

    if (phase === "typing") {
      if (typedChars < cmd.cmd.length) {
        const t = setTimeout(() => setTypedChars((c) => c + 1), CHAR_DELAY);
        return () => clearTimeout(t);
      } else {
        setPhase("output");
        setVisibleLines(0);
      }
    } else if (phase === "output") {
      if (visibleLines < cmd.output.length) {
        const t = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY);
        return () => clearTimeout(t);
      } else {
        setPhase("pause");
      }
    } else {
      const t = setTimeout(() => {
        const next = (cmdIdx + 1) % TERMINAL_COMMANDS.length;
        setCmdIdx(next);
        setTypedChars(0);
        setVisibleLines(0);
        setPhase("typing");
      }, CMD_PAUSE);
      return () => clearTimeout(t);
    }
  }, [phase, typedChars, visibleLines, cmdIdx, cmd, prefersReduced]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#040608]/90 backdrop-blur-sm overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-mono text-white/30">dso — bash</span>
        </div>
      </div>

      <div className="p-5 font-mono text-sm space-y-1 min-h-[180px]">
        <div className="flex items-center gap-2">
          <span className="text-[#00E6C0]">$</span>
          <span className="text-white/90">{cmd.cmd.slice(0, typedChars)}</span>
          {phase === "typing" && (
            <span className="inline-block w-2 h-4 bg-[#00E6C0] animate-pulse" />
          )}
        </div>

        {cmd.output.slice(0, visibleLines).map((line, i) => (
          <div
            key={`${cmdIdx}-${i}`}
            className={`pl-4 ${
              line.startsWith("✓") ? "text-emerald-400" : "text-white/50"
            }`}
          >
            {line}
          </div>
        ))}

        {phase === "pause" && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[#00E6C0]">$</span>
            <span className="inline-block w-2 h-4 bg-white/40 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export const HeroNew = () => {
  const prefersReduced = useReducedMotion() ?? false;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(0,230,192,0.07) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(109,93,246,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {["Docker Native", "Open Source", "Apache 2.0"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border"
              style={{
                borderColor: "rgba(0,230,192,0.25)",
                background: "rgba(0,230,192,0.06)",
                color: "#00E6C0",
              }}
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1
            className="font-bold tracking-tighter leading-[0.92] mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            <span style={{ color: "#F8FAFC" }}>Rotate Secrets.</span>
            <br />
            <span
              style={{
                color: "#00E6C0",
                textShadow: "0 0 60px rgba(0,230,192,0.35)",
              }}
            >
              Zero Downtime.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#94A3B8" }}
        >
          DSO is an open-source runtime secret injection engine for Docker.
          Rotate credentials automatically — no restarts, no manual scripts, no
          downtime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href={ROUTES.landingPages.deploy}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base text-[#05070A] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "#00E6C0",
              boxShadow: "0 0 40px rgba(0,230,192,0.3)",
            }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={ROUTES.docs.root}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border transition-all duration-200 hover:border-white/30 hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "#94A3B8",
            }}
          >
            Documentation
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="w-4 h-4" style={{ color: "#94A3B8" }} />
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              Live demo
            </span>
          </div>
          <AnimatedTerminal prefersReduced={prefersReduced} />
        </motion.div>
      </div>
    </section>
  );
};
