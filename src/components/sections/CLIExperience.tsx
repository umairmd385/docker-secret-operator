"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash";

const COMMANDS = [
  {
    cmd: "docker dso init",
    lines: [
      { text: "✓ DSO configuration created (.dso/config.yaml)", ok: true },
      { text: "✓ Provider detected: aws-secrets-manager", ok: true },
      { text: "✓ Initialization complete", ok: true },
    ],
  },
  {
    cmd: "docker dso up",
    lines: [
      { text: "  Starting DSO engine...", ok: false },
      { text: "✓ Engine started (PID 4821)", ok: true },
      { text: "✓ Watching 3 secret paths", ok: true },
    ],
  },
  {
    cmd: "docker dso sync --secret postgres-password",
    lines: [
      { text: "  Fetching from aws-secrets-manager...", ok: false },
      { text: "✓ Secret fetched (version: v42)", ok: true },
      { text: "✓ New container staged and healthy (1.9s)", ok: true },
      { text: "✓ Traffic swapped — 0 requests failed", ok: true },
    ],
  },
  {
    cmd: "docker dso status",
    lines: [
      { text: "  Status:        running", ok: false },
      { text: "  Provider:      aws-secrets-manager", ok: false },
      { text: "  Last sync:     3 seconds ago", ok: false },
      { text: "  Uptime:        47 days", ok: false },
    ],
  },
];

const CHAR_DELAY = 35;
const LINE_DELAY = 160;
const CMD_PAUSE = 1600;

const Terminal = () => {
  const [cmdIdx, setCmdIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "lines" | "pause">("typing");

  const cur = COMMANDS[cmdIdx];

  useEffect(() => {
    if (phase === "typing") {
      if (typed < cur.cmd.length) {
        const t = setTimeout(() => setTyped((c) => c + 1), CHAR_DELAY);
        return () => clearTimeout(t);
      }
      setPhase("lines");
      setLines(0);
    } else if (phase === "lines") {
      if (lines < cur.lines.length) {
        const t = setTimeout(() => setLines((l) => l + 1), LINE_DELAY);
        return () => clearTimeout(t);
      }
      setPhase("pause");
    } else {
      const t = setTimeout(() => {
        const next = (cmdIdx + 1) % COMMANDS.length;
        setCmdIdx(next);
        setTyped(0);
        setLines(0);
        setPhase("typing");
      }, CMD_PAUSE);
      return () => clearTimeout(t);
    }
  }, [phase, typed, lines, cmdIdx, cur]);

  return (
    <div
      className="rounded-xl border overflow-hidden shadow-2xl"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "#030508" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span
          className="flex-1 text-center text-xs font-mono"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          dso — bash
        </span>
      </div>
      <div className="p-5 font-mono text-sm space-y-1 min-h-[200px]">
        <div className="flex items-center gap-2">
          <span style={{ color: "#00E6C0" }}>$</span>
          <span style={{ color: "#F8FAFC" }}>{cur.cmd.slice(0, typed)}</span>
          {phase === "typing" && (
            <span
              className="inline-block w-2 h-4 animate-pulse"
              style={{ background: "#00E6C0" }}
            />
          )}
        </div>
        {cur.lines.slice(0, lines).map((line, i) => (
          <div
            key={`${cmdIdx}-${i}`}
            className="pl-4"
            style={{
              color: line.ok ? "#34d399" : "rgba(255,255,255,0.45)",
            }}
          >
            {line.text}
          </div>
        ))}
        {phase === "pause" && (
          <div className="flex items-center gap-2 pt-1">
            <span style={{ color: "#00E6C0" }}>$</span>
            <span
              className="inline-block w-2 h-4 animate-pulse"
              style={{ background: "rgba(255,255,255,0.3)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const CLIExperience = () => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            CLI
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            Built for operators
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Full lifecycle control from the command line. Works with your existing Docker workflow.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: install + command list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "#94A3B8" }}
              >
                Install in one command
              </p>
              <div
                className="flex items-center gap-2 p-4 rounded-xl font-mono text-sm overflow-x-auto"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-[#00E6C0] flex-shrink-0">$</span>
                <span className="text-white/70 flex-1 min-w-0 truncate">
                  {INSTALL_CMD}
                </span>
                <button
                  onClick={copy}
                  className="flex-shrink-0 p-1.5 rounded-md transition-colors hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" style={{ color: "#94A3B8" }} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { cmd: "docker dso setup", desc: "Interactive setup wizard" },
                { cmd: "docker dso up", desc: "Deploy stack with secret injection" },
                { cmd: "docker dso status", desc: "Show runtime operational status" },
                { cmd: "docker dso sync --secret <name>", desc: "Trigger immediate synchronization" },
                { cmd: "docker dso validate", desc: "Validate DSO configuration" },
                { cmd: "docker dso diff", desc: "Show config vs deployed diff" },
                { cmd: "docker dso logs", desc: "View DSO agent logs" },
                { cmd: "docker dso secret set <path>", desc: "Store a secret in local vault" },
              ].map(({ cmd, desc }) => (
                <div key={cmd} className="flex gap-4 items-start">
                  <code
                    className="text-xs font-mono px-2 py-1 rounded flex-shrink-0"
                    style={{
                      background: "rgba(0,230,192,0.08)",
                      color: "#00E6C0",
                      border: "1px solid rgba(0,230,192,0.15)",
                    }}
                  >
                    {cmd}
                  </code>
                  <p
                    className="text-sm pt-0.5"
                    style={{ color: "#94A3B8" }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: animated terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
