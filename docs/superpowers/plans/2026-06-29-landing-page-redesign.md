# DSO Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign DSO's landing page into a premium, DragonflyDB-quality developer experience while preserving DSO's teal brand identity and adding Huawei Cloud CSMS as a provider.

**Architecture:** Replace 8 existing landing-page section components with 10 new ones organized in a compelling narrative flow (Hero → Why → How → Capabilities → Providers → CLI → Security → CTA). Update design tokens globally so every page benefits from the richer palette.

**Tech Stack:** Next.js 15 App Router, React 18, Framer Motion, Lucide React, Tailwind CSS v4, TypeScript, Plus Jakarta Sans + JetBrains Mono fonts.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/app/globals.css` | Update design tokens (bg, surface, muted, accent-secondary) |
| Modify | `src/components/ui/Typography.tsx` | Upgrade H1 to display scale |
| Modify | `src/app/page.tsx` | New section import/order, remove old imports |
| **Create** | `src/components/sections/HeroNew.tsx` | Centered hero with terminal |
| **Create** | `src/components/sections/MetricsStrip.tsx` | 5-metric proof strip |
| **Create** | `src/components/sections/WhySecretsFail.tsx` | Problem timeline (replaces ProblemSection) |
| **Create** | `src/components/sections/HowDSOWorks.tsx` | Animated architecture flow |
| **Create** | `src/components/sections/SecretLifecycle.tsx` | 5-step auto-advancing timeline |
| **Create** | `src/components/sections/KeyCapabilities.tsx` | 6 glassmorphism feature cards |
| **Create** | `src/components/sections/ProviderEcosystem.tsx` | 5 provider cards incl. Huawei CSMS |
| **Create** | `src/components/sections/CLIExperience.tsx` | 2-panel CLI with typing animation |
| **Create** | `src/components/sections/SecurityGuarantees.tsx` | 5 security guarantee cards |
| **Create** | `src/components/sections/FinalCTA.tsx` | Community links + final CTA |
| Delete | `src/components/sections/Hero.tsx` | Superseded by HeroNew |
| Delete | `src/components/sections/StatsStrip.tsx` | Superseded by MetricsStrip |
| Delete | `src/components/sections/ProblemSection.tsx` | Superseded by WhySecretsFail |
| Delete | `src/components/sections/TerminalDemo.tsx` | Superseded by CLIExperience |
| Delete | `src/components/sections/ProductPreview.tsx` | Absorbed into CLIExperience |
| Delete | `src/components/sections/WhyDSOExists.tsx` | Absorbed into KeyCapabilities |
| Delete | `src/components/sections/BuiltForFailures.tsx` | Absorbed into SecurityGuarantees |
| Delete | `src/components/sections/InstallationSimple.tsx` | Absorbed into FinalCTA |
| Delete | `src/components/sections/TrustAndCTA.tsx` | Superseded by FinalCTA |

---

## Task 1: Update Design Tokens

**Files:**
- Modify: `src/app/globals.css` (lines 6–16)

- [ ] **Step 1: Update the `:root` legacy variables block**

Replace the existing block:
```css
:root {
  /* Legacy variables */
  --background: #05070A;
  --foreground: #F8FAFC;
  --surface: #0B1118;
  --surface2: #080D13;
  --surface-hover: #111827;
  --accent: #00E6C0;
  --accent-secondary: #6D5DF6;
  --accent-dim: rgba(0, 230, 192, 0.1);
  --muted: #94A3B8;
  --border: rgba(255, 255, 255, 0.08);
  --border-soft: rgba(255, 255, 255, 0.04);
```

- [ ] **Step 2: Add accent-secondary to the `@theme inline` block**

In `globals.css`, inside the `@theme inline { }` block, add after `--color-accent-dim`:
```css
  --color-accent-secondary: var(--accent-secondary);
  --color-muted: var(--muted);
```

- [ ] **Step 3: Verify TypeScript and build pass**

```bash
cd /data/umair_atr1123/All_Data/Antigravity_Work/docker-secret-operator
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "design: update color tokens to premium dark palette"
```

---

## Task 2: Upgrade H1 Typography Scale

**Files:**
- Modify: `src/components/ui/Typography.tsx` (lines 9–21)

- [ ] **Step 1: Increase H1 size to display scale**

Replace the H1 className:
```tsx
export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground tracking-tighter leading-[0.95]",
        className
      )}
      {...props}
    />
  )
);
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit 2>&1 | head -5
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Typography.tsx
git commit -m "design: upgrade H1 to display scale for premium hero"
```

---

## Task 3: Create HeroNew Component

**Files:**
- Create: `src/components/sections/HeroNew.tsx`

This is a centered hero with: large two-tone headline, subheading, two CTAs, animated terminal, and background radial orbs.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
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

const CHAR_DELAY = 38; // ms per character
const LINE_DELAY = 180; // ms between output lines
const CMD_PAUSE = 1400; // ms after command completes before next

const AnimatedTerminal = ({ prefersReduced }: { prefersReduced: boolean }) => {
  const [cmdIdx, setCmdIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");

  const cmd = TERMINAL_COMMANDS[cmdIdx];

  useEffect(() => {
    if (prefersReduced) {
      // Show everything instantly
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
        const t = setTimeout(
          () => setVisibleLines((v) => v + 1),
          LINE_DELAY
        );
        return () => clearTimeout(t);
      } else {
        setPhase("pause");
      }
    } else {
      // pause
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
      {/* Window chrome */}
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

      {/* Terminal body */}
      <div className="p-5 font-mono text-sm space-y-1 min-h-[180px]">
        {/* Prompt + typed command */}
        <div className="flex items-center gap-2">
          <span className="text-[#00E6C0]">$</span>
          <span className="text-white/90">{cmd.cmd.slice(0, typedChars)}</span>
          {phase === "typing" && (
            <span className="inline-block w-2 h-4 bg-[#00E6C0] animate-pulse" />
          )}
        </div>

        {/* Output lines */}
        {cmd.output.slice(0, visibleLines).map((line, i) => (
          <div
            key={`${cmdIdx}-${i}`}
            className={`pl-4 ${
              line.startsWith("✓")
                ? "text-emerald-400"
                : "text-white/50"
            }`}
          >
            {line}
          </div>
        ))}

        {/* Idle cursor after output */}
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
      {/* Background radial orbs */}
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
        {/* Eyebrow badges */}
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

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1
            className="font-bold tracking-tighter leading-[0.92] mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            <span className="text-[#F8FAFC]">Rotate Secrets.</span>
            <br />
            <span
              className="text-[#00E6C0]"
              style={{
                textShadow: "0 0 60px rgba(0,230,192,0.35)",
              }}
            >
              Zero Downtime.
            </span>
          </h1>
        </motion.div>

        {/* Subheading */}
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

        {/* CTAs */}
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

        {/* Terminal */}
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroNew.tsx
git commit -m "feat: add premium centered Hero with animated terminal"
```

---

## Task 4: Create MetricsStrip Component

**Files:**
- Create: `src/components/sections/MetricsStrip.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const METRICS = [
  { value: "Zero", label: "Downtime", teal: true },
  { value: "Runtime", label: "Secret Injection", teal: false },
  { value: "5+", label: "Secret Providers", teal: true },
  { value: "Zero", label: "Disk Persistence", teal: false },
  { value: "Auto", label: "Rotation", teal: true },
];

export const MetricsStrip = () => {
  return (
    <section
      className="relative border-y"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,230,192,0.03), transparent 30%, transparent 70%, rgba(109,93,246,0.03))",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {METRICS.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="px-6 py-8 text-center"
              style={{
                borderRight:
                  idx < METRICS.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : undefined,
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1"
                style={{
                  color: m.teal ? "#00E6C0" : "#F8FAFC",
                  textShadow: m.teal
                    ? "0 0 24px rgba(0,230,192,0.2)"
                    : undefined,
                }}
              >
                {m.value}
              </div>
              <div
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "#94A3B8" }}
              >
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MetricsStrip.tsx
git commit -m "feat: add 5-metric proof strip"
```

---

## Task 5: Create WhySecretsFail Component

**Files:**
- Create: `src/components/sections/WhySecretsFail.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Clock, AlertCircle, PhoneCall } from "lucide-react";

const STEPS = [
  {
    icon: Zap,
    time: "T+0s",
    title: "Secret Changes",
    desc: "Password rotated in your secret provider.",
  },
  {
    icon: Clock,
    time: "T+5m",
    title: "Manual Restart",
    desc: "Team scrambles to restart containers manually.",
  },
  {
    icon: AlertCircle,
    time: "T+7m",
    title: "Connections Drop",
    desc: "Active requests fail. Customers see errors.",
  },
  {
    icon: PhoneCall,
    time: "T+10m",
    title: "On-Call Panic",
    desc: "Incident channel lights up. Pages go out.",
  },
];

export const WhySecretsFail = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      {/* Section label */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
            The problem
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            Secret rotation today
            <br />
            <span style={{ color: "#ef4444" }}>breaks production.</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "#94A3B8" }}
          >
            Teams choose: rotate and accept downtime, or skip rotation and
            accept risk.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div
            className="absolute left-[28px] top-10 bottom-10 w-px hidden sm:block"
            style={{
              background:
                "linear-gradient(to bottom, rgba(239,68,68,0.4), rgba(239,68,68,0.05))",
            }}
          />

          <div className="space-y-5">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex gap-5 p-5 rounded-xl border cursor-default transition-all duration-300"
                  style={{
                    borderColor: "rgba(239,68,68,0.12)",
                    background: "rgba(239,68,68,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(239,68,68,0.35)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(239,68,68,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(239,68,68,0.12)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(239,68,68,0.03)";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#f87171",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className="font-semibold text-base mb-1"
                          style={{ color: "#F8FAFC" }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm" style={{ color: "#94A3B8" }}>
                          {step.desc}
                        </p>
                      </div>
                      <span
                        className="text-xs font-mono flex-shrink-0 pt-0.5"
                        style={{ color: "#f87171" }}
                      >
                        {step.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="mt-8 p-6 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p className="font-semibold mb-1" style={{ color: "#F8FAFC" }}>
              The result
            </p>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              Downtime, failed requests, customer impact. Many teams skip
              rotation entirely — leaving secrets unchanged for months. That's
              worse.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WhySecretsFail.tsx
git commit -m "feat: add WhySecretsFail section with upgraded timeline"
```

---

## Task 6: Create HowDSOWorks Component

**Files:**
- Create: `src/components/sections/HowDSOWorks.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
  icon: React.ComponentType<{ className?: string }>;
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
    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
      {sub}
    </p>
  </motion.div>
);

const Connector = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scaleY: 0 }}
    whileInView={{ opacity: 1, scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.35 }}
    className="flex flex-col items-center gap-1 origin-top"
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
            An event-driven engine sits between your secret provider and Docker
            containers — rotating credentials without touching production traffic.
          </p>
        </motion.div>

        {/* Flow — desktop: horizontal, mobile: vertical */}
        <div className="hidden md:flex items-center justify-center gap-0">
          {NODES.map((node, idx) => (
            <React.Fragment key={idx}>
              <FlowNode {...node} delay={idx * 0.12} />
              {idx < NODES.length - 1 && (
                <div className="flex items-center gap-1 px-2 flex-shrink-0">
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowDSOWorks.tsx
git commit -m "feat: add animated HowDSOWorks architecture flow"
```

---

## Task 7: Create SecretLifecycle Component

**Files:**
- Create: `src/components/sections/SecretLifecycle.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Lock, Zap, RefreshCw, Trash2 } from "lucide-react";

const STAGES = [
  {
    icon: PlusCircle,
    label: "Create",
    desc: "Secret is created in your provider with appropriate permissions and policies.",
    color: "#00E6C0",
  },
  {
    icon: Lock,
    label: "Encrypt",
    desc: "Secret is encrypted at rest and in transit. Never written to disk.",
    color: "#6D5DF6",
  },
  {
    icon: Zap,
    label: "Inject",
    desc: "DSO injects the secret at runtime directly into the container environment.",
    color: "#00E6C0",
  },
  {
    icon: RefreshCw,
    label: "Rotate",
    desc: "DSO detects changes and performs zero-downtime rotation automatically.",
    color: "#6D5DF6",
  },
  {
    icon: Trash2,
    label: "Destroy",
    desc: "On container stop, secrets are purged from memory. No lingering credentials.",
    color: "#f87171",
  },
];

export const SecretLifecycle = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const stage = STAGES[active];

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
            Lifecycle
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            Secret lifecycle
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Every secret follows a controlled path from creation to destruction.
            DSO manages every step automatically.
          </p>
        </motion.div>

        {/* Stage pills — desktop horizontal */}
        <div className="flex items-center justify-center gap-0 mb-12 overflow-x-auto pb-2">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === active;
            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setActive(idx)}
                  className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 flex-shrink-0"
                  style={{
                    background: isActive
                      ? `${s.color}14`
                      : "transparent",
                    border: isActive
                      ? `1px solid ${s.color}40`
                      : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: isActive ? `${s.color}20` : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isActive ? s.color : "#94A3B8" }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isActive ? s.color : "#94A3B8" }}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < STAGES.length - 1 && (
                  <div
                    className="w-8 h-px flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active stage description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center p-8 rounded-2xl"
            style={{
              background: `${stage.color}08`,
              border: `1px solid ${stage.color}25`,
            }}
          >
            <p
              className="text-xl font-semibold mb-2"
              style={{ color: stage.color }}
            >
              {stage.label}
            </p>
            <p className="text-base" style={{ color: "#94A3B8" }}>
              {stage.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  idx === active ? "#00E6C0" : "rgba(255,255,255,0.2)",
                transform: idx === active ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SecretLifecycle.tsx
git commit -m "feat: add auto-advancing SecretLifecycle section"
```

---

## Task 8: Create KeyCapabilities Component

**Files:**
- Create: `src/components/sections/KeyCapabilities.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, RefreshCw, Puzzle, Container, FileCheck } from "lucide-react";

const CAPS = [
  {
    icon: Zap,
    title: "Runtime Injection",
    desc: "Secrets injected at container start — never baked into images or configs.",
    accent: false,
  },
  {
    icon: Shield,
    title: "Zero Persistence",
    desc: "Nothing written to disk. Secrets exist only in container memory at runtime.",
    accent: true,
  },
  {
    icon: RefreshCw,
    title: "Automatic Rotation",
    desc: "Detect, rotate, and verify — completely hands-free. Rollback on failure.",
    accent: false,
  },
  {
    icon: Puzzle,
    title: "Provider Plugins",
    desc: "Swap providers without changing application code. AWS, Vault, Azure, Huawei.",
    accent: false,
  },
  {
    icon: Container,
    title: "Docker Native",
    desc: "Built for Docker Compose. No Kubernetes, no cloud lock-in, no agents.",
    accent: true,
  },
  {
    icon: FileCheck,
    title: "Audit Ready",
    desc: "Complete rotation audit trail. Every event logged, timestamped, traceable.",
    accent: false,
  },
];

export const KeyCapabilities = () => {
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
            Capabilities
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5"
            style={{ color: "#F8FAFC" }}
          >
            What DSO delivers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
                style={{
                  background: cap.accent
                    ? "rgba(0,230,192,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: cap.accent
                    ? "1px solid rgba(0,230,192,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(0,230,192,0.35)";
                  el.style.boxShadow = "0 8px 32px rgba(0,230,192,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = cap.accent
                    ? "rgba(0,230,192,0.2)"
                    : "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
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
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  {cap.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/KeyCapabilities.tsx
git commit -m "feat: add 6-capability glassmorphism card grid"
```

---

## Task 9: Create ProviderEcosystem Component (includes Huawei CSMS)

**Files:**
- Create: `src/components/sections/ProviderEcosystem.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Cloud, Key, Globe, HardDrive } from "lucide-react";

const PROVIDERS = [
  {
    icon: Lock,
    name: "HashiCorp Vault",
    desc: "Self-hosted or HCP Vault. The industry standard for enterprise secret management.",
    badges: ["Rotation", "Injection", "Audit", "TLS"],
    href: "/deploy#vault",
  },
  {
    icon: Cloud,
    name: "AWS Secrets Manager",
    desc: "Native AWS secret management. Full IAM integration with automatic versioning.",
    badges: ["Rotation", "Injection", "IAM"],
    href: "/deploy#aws",
  },
  {
    icon: Key,
    name: "Azure Key Vault",
    desc: "Microsoft Azure's managed HSM and secret storage with Azure AD integration.",
    badges: ["Rotation", "Injection", "RBAC"],
    href: "/deploy#azure",
  },
  {
    icon: Globe,
    name: "Huawei Cloud CSMS",
    desc: "Cloud Secret Management Service — enterprise-grade secret storage on Huawei Cloud.",
    badges: ["Rotation", "Injection", "Audit"],
    href: "/deploy#huawei",
    featured: true,
  },
  {
    icon: HardDrive,
    name: "Local Secrets",
    desc: "Encrypted local vault for development and air-gapped environments. No cloud required.",
    badges: ["Injection", "Offline", "Dev-friendly"],
    href: "/deploy#local",
  },
];

export const ProviderEcosystem = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      {/* Background glow */}
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
            Swap providers without changing application code. DSO speaks to
            each provider natively.
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
                {/* Header */}
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

                {/* Badges */}
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProviderEcosystem.tsx
git commit -m "feat: add ProviderEcosystem with Huawei Cloud CSMS support"
```

---

## Task 10: Create CLIExperience Component

**Files:**
- Create: `src/components/sections/CLIExperience.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
    cmd: "docker dso rotate postgres-password",
    lines: [
      { text: "  Fetching from aws-secrets-manager...", ok: false },
      { text: "✓ Secret fetched (version: v42)", ok: true },
      { text: "✓ New container staged and healthy (1.9s)", ok: true },
      { text: "✓ Traffic swapped — 0 requests failed", ok: true },
    ],
  },
  {
    cmd: "docker dso inspect",
    lines: [
      { text: "  Status:        running", ok: false },
      { text: "  Provider:      aws-secrets-manager", ok: false },
      { text: "  Rotations:     12 (last: 3 seconds ago)", ok: false },
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
    <div className="rounded-xl border overflow-hidden shadow-2xl"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "#030508" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="flex-1 text-center text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
          dso — bash
        </span>
      </div>
      <div className="p-5 font-mono text-sm space-y-1 min-h-[200px]">
        <div className="flex items-center gap-2">
          <span style={{ color: "#00E6C0" }}>$</span>
          <span style={{ color: "#F8FAFC" }}>{cur.cmd.slice(0, typed)}</span>
          {phase === "typing" && (
            <span className="inline-block w-2 h-4 animate-pulse" style={{ background: "#00E6C0" }} />
          )}
        </div>
        {cur.lines.slice(0, lines).map((line, i) => (
          <div key={`${cmdIdx}-${i}`} className="pl-4" style={{ color: line.ok ? "#34d399" : "rgba(255,255,255,0.45)" }}>
            {line.text}
          </div>
        ))}
        {phase === "pause" && (
          <div className="flex items-center gap-2 pt-1">
            <span style={{ color: "#00E6C0" }}>$</span>
            <span className="inline-block w-2 h-4 animate-pulse" style={{ background: "rgba(255,255,255,0.3)" }} />
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
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
            CLI
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5" style={{ color: "#F8FAFC" }}>
            Built for operators
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Full control from the command line. One install command. Works with your existing Docker workflow.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: install + description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: "#94A3B8" }}>
                Install in one command
              </p>
              <div className="flex items-center gap-2 p-4 rounded-xl font-mono text-sm overflow-x-auto"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-[#00E6C0] flex-shrink-0">$</span>
                <span className="text-white/70 flex-1 min-w-0 truncate">{INSTALL_CMD}</span>
                <button onClick={copy} className="flex-shrink-0 p-1.5 rounded-md transition-colors hover:bg-white/10">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" style={{ color: "#94A3B8" }} />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { cmd: "docker dso init", desc: "Initialize DSO config and detect your provider" },
                { cmd: "docker dso up", desc: "Start the rotation engine" },
                { cmd: "docker dso rotate <secret>", desc: "Trigger a manual zero-downtime rotation" },
                { cmd: "docker dso inspect", desc: "View runtime status and audit trail" },
              ].map(({ cmd, desc }) => (
                <div key={cmd} className="flex gap-4 items-start">
                  <code className="text-xs font-mono px-2 py-1 rounded flex-shrink-0"
                    style={{ background: "rgba(0,230,192,0.08)", color: "#00E6C0", border: "1px solid rgba(0,230,192,0.15)" }}>
                    {cmd}
                  </code>
                  <p className="text-sm pt-0.5" style={{ color: "#94A3B8" }}>{desc}</p>
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CLIExperience.tsx
git commit -m "feat: add two-panel CLIExperience with typing animation"
```

---

## Task 11: Create SecurityGuarantees Component

**Files:**
- Create: `src/components/sections/SecurityGuarantees.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
            Security
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-5" style={{ color: "#F8FAFC" }}>
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
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,230,192,0.1)", border: "1px solid rgba(0,230,192,0.2)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#00E6C0" }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: "#F8FAFC" }}>
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SecurityGuarantees.tsx
git commit -m "feat: add SecurityGuarantees section"
```

---

## Task 12: Create FinalCTA Component

**Files:**
- Create: `src/components/sections/FinalCTA.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, BookOpen, MessageSquare, Tag, FileText } from "lucide-react";
import { ROUTES } from "@/lib/links";

const COMMUNITY = [
  { icon: Github, label: "GitHub", href: "https://github.com/docker-secret-operator/dso" },
  { icon: BookOpen, label: "Documentation", href: ROUTES.docs.root },
  { icon: MessageSquare, label: "Discussions", href: "https://github.com/docker-secret-operator/dso/discussions" },
  { icon: Tag, label: "Releases", href: "https://github.com/docker-secret-operator/dso/releases" },
  { icon: FileText, label: "Apache 2.0", href: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE" },
];

export const FinalCTA = () => {
  return (
    <section className="relative py-24 sm:py-40 overflow-hidden">
      {/* Large teal glow stage */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(0,230,192,0.07) 0%, transparent 60%)",
          filter: "blur(40px)",
        }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Community links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mb-20"
        >
          {COMMUNITY.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#94A3B8" }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="font-bold tracking-tighter mb-6"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#F8FAFC", lineHeight: "1.05" }}
          >
            Start rotating secrets
            <br />
            <span style={{ color: "#00E6C0", textShadow: "0 0 50px rgba(0,230,192,0.3)" }}>
              in minutes.
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="text-lg mb-10"
          style={{ color: "#94A3B8" }}
        >
          No manual scripts. No container restarts. No downtime.
          One command to install, one command to start.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={ROUTES.landingPages.deploy}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-base text-[#05070A] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "#00E6C0",
              boxShadow: "0 0 50px rgba(0,230,192,0.35)",
            }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={ROUTES.docs.root}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-base border transition-all duration-200 hover:border-white/30 hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.12)", color: "#94A3B8" }}
          >
            Read the docs
          </a>
        </motion.div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FinalCTA.tsx
git commit -m "feat: add premium FinalCTA with community links"
```

---

## Task 13: Wire Up page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace entire page.tsx**

```tsx
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroNew } from "@/components/sections/HeroNew";
import { MetricsStrip } from "@/components/sections/MetricsStrip";
import { WhySecretsFail } from "@/components/sections/WhySecretsFail";
import { HowDSOWorks } from "@/components/sections/HowDSOWorks";
import { SecretLifecycle } from "@/components/sections/SecretLifecycle";
import { KeyCapabilities } from "@/components/sections/KeyCapabilities";
import { ProviderEcosystem } from "@/components/sections/ProviderEcosystem";
import { CLIExperience } from "@/components/sections/CLIExperience";
import { SecurityGuarantees } from "@/components/sections/SecurityGuarantees";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = generatePageMetadata(PAGE_METADATA["/"], "/");

export default function Home() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "#05070A" }}>
      {/* Global ambient background — fixed, behind all content */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,230,192,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "700px",
          height: "600px",
          background: "radial-gradient(ellipse at 100% 100%, rgba(109,93,246,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroNew />
        <MetricsStrip />
        <WhySecretsFail />
        <HowDSOWorks />
        <SecretLifecycle />
        <KeyCapabilities />
        <ProviderEcosystem />
        <CLIExperience />
        <SecurityGuarantees />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output.

- [ ] **Step 3: Verify production build succeeds**

```bash
npx next build 2>&1 | tail -10
```
Expected: build completes with ○ and ƒ route markers, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up new landing page section order"
```

---

## Task 14: Delete Superseded Components

**Files to delete:**
- `src/components/sections/Hero.tsx`
- `src/components/sections/StatsStrip.tsx`
- `src/components/sections/ProblemSection.tsx`
- `src/components/sections/TerminalDemo.tsx`
- `src/components/sections/ProductPreview.tsx`
- `src/components/sections/WhyDSOExists.tsx`
- `src/components/sections/BuiltForFailures.tsx`
- `src/components/sections/InstallationSimple.tsx`
- `src/components/sections/TrustAndCTA.tsx`

- [ ] **Step 1: Delete old files**

```bash
rm \
  src/components/sections/Hero.tsx \
  src/components/sections/StatsStrip.tsx \
  src/components/sections/ProblemSection.tsx \
  src/components/sections/TerminalDemo.tsx \
  src/components/sections/ProductPreview.tsx \
  src/components/sections/WhyDSOExists.tsx \
  src/components/sections/BuiltForFailures.tsx \
  src/components/sections/InstallationSimple.tsx \
  src/components/sections/TrustAndCTA.tsx
```

- [ ] **Step 2: Verify build still passes**

```bash
npx tsc --noEmit 2>&1 | head -20
npx next build 2>&1 | tail -8
```
Expected: no TypeScript errors, build completes cleanly.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove superseded landing page components"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Centered hero with large headline | Task 3 |
| Animated terminal (dso init/up/rotate/inspect) | Task 3 |
| Background radial orbs | Task 3 + Task 13 |
| 5-metric strip | Task 4 |
| Problem/why section | Task 5 |
| Architecture flow diagram | Task 6 |
| Secret lifecycle timeline | Task 7 |
| 6 feature capability cards | Task 8 |
| Provider cards with Huawei CSMS | Task 9 |
| CLI two-panel + typing animation | Task 10 |
| Security guarantees | Task 11 |
| Community links + final CTA | Task 12 |
| New token values (#05070A, #0B1118, etc.) | Task 1 |
| H1 display scale upgrade | Task 2 |
| page.tsx section order | Task 13 |
| Old components deleted | Task 14 |
| Huawei CSMS provider | Task 9 |
| `prefers-reduced-motion` respected | Task 3 (useReducedMotion hook) |
| No new npm dependencies | ✓ All use existing framer-motion + lucide-react |
| TypeScript safe | ✓ Each task verifies with `npx tsc --noEmit` |
| No broken routing/SEO | ✓ page.tsx keeps same metadata exports |

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:** `COMMANDS`, `METRICS`, `PROVIDERS`, `GUARANTEES`, `CAPS`, `STAGES`, `STEPS`, `NODES` are all locally defined arrays — no cross-task type dependencies.
