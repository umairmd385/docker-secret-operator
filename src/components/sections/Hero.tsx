"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { OperationalTopology } from "./OperationalTopology";
import { CheckCircle2, ChevronRight, Zap, RotateCw, Clock } from "lucide-react";

const localSteps = [
  { label: "Step 1: Install DSO", text: "$ curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash", delay: 500, typing: true },
  { label: "Step 2: Bootstrap Local Mode", text: "$ docker dso bootstrap local", delay: 4000, typing: true },
  { label: "Step 3: Set Secret", text: "$ docker dso secret set DB_PASSWORD mysecret", delay: 7000, typing: true },
  { label: "Step 4: Deploy Stack", text: "$ docker dso up -d", delay: 10000, typing: true },
  { text: "✔ system ready: local vault initialized", type: "info", delay: 12500, typing: false },
];

const cloudSteps = [
  { label: "Step 1: Install DSO", text: "$ sudo curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash", delay: 500, typing: true },
  { label: "Step 2: Bootstrap Agent Mode", text: "$ sudo docker dso bootstrap agent", delay: 4000, typing: true },
  { label: "Step 3: Setup Cloud Provider", text: "$ sudo docker dso system setup --providers aws", delay: 7000, typing: true },
  { text: "✔ agent ready: aws-secrets-manager connected & verified", type: "success", delay: 9500, typing: false },
];

export const Hero = () => {
  const [mode, setMode] = useState<"local" | "cloud">("local");
  const [lines, setLines] = useState<{text: string, type?: string, typing: boolean, label?: string}[]>([]);
  const [typingIndex, setTypingIndex] = useState(-1);
  const [currentTypedText, setCurrentTypedText] = useState("");

  useEffect(() => {
    setLines([]);
    setTypingIndex(-1);
    setCurrentTypedText("");

    const steps = mode === "local" ? localSteps : cloudSteps;
    let timeouts: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      const t = setTimeout(() => {
        if (step.typing) {
          setTypingIndex(index);
          setCurrentTypedText("");
          let i = 0;
          const typeChar = () => {
             setCurrentTypedText(step.text.slice(0, i));
             i++;
             if (i > step.text.length) {
                setLines(prev => [...prev, step as any]);
                setTypingIndex(-1);
                if (mode === "local" && index === steps.length - 1) {
                  setTimeout(() => setMode("cloud"), 3000);
                } else if (mode === "cloud" && index === steps.length - 1) {
                  setTimeout(() => setMode("local"), 3000);
                }
             } else {
                const charTime = setTimeout(typeChar, 30);
                timeouts.push(charTime);
             }
          };
          typeChar();
        } else {
          setLines(prev => [...prev, step as any]);
          if (mode === "local" && index === steps.length - 1) {
            setTimeout(() => setMode("cloud"), 3000);
          } else if (mode === "cloud" && index === steps.length - 1) {
            setTimeout(() => setMode("local"), 3000);
          }
        }
      }, step.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [mode]);

  return (
    <section className="relative pt-20 sm:pt-32 md:pt-40 pb-20 sm:pb-32 md:pb-40 overflow-hidden bg-background">
      {/* Layered atmospheric lighting for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-40" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/3 via-transparent to-transparent rounded-full blur-[120px] opacity-60" />
      </div>
      <OperationalTopology />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center will-change-transform w-full"
          >
            <p className="text-[10px] sm:text-xs font-mono text-accent/60 tracking-widest uppercase mb-6 sm:mb-8">
              ◆ PRODUCTION GRADE RECOVERY ◆
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-8 sm:mb-10 max-w-4xl">
              Secrets Rotate. <br />
              <span className="text-accent">Systems Recover.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-12 max-w-2xl">
              Built for runtime failures. Automatic recovery, atomic swaps, zero downtime. Production-safe secret rotation designed for DevOps teams that can't afford rotations to fail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 sm:mb-20 w-full sm:w-auto">
              <Button href="#quick-start" size="lg" className="group h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all">
                Quick Start
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/docs/index.html" variant="secondary" size="lg" className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg border-white/5 bg-white/10">
                Documentation
              </Button>
            </div>

            <div className="w-full max-w-md">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <StatCard icon={Zap} label="Zero-Downtime" value="Rotations" delay={0.2} />
                <StatCard icon={RotateCw} label="Automatic" value="Recovery" delay={0.3} />
                <StatCard icon={Clock} label="Production" value="Safe" delay={0.4} />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="relative w-full max-w-2xl mx-auto will-change-transform"
        >
          <div className="absolute -inset-4 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f16]/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex gap-2">
                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  {mode === "local" ? "Vault" : "Cloud"}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                 <div className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded border transition-colors ${mode === 'local' ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-gray-500'}`}>LOCAL</div>
                 <div className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded border transition-colors ${mode === 'cloud' ? 'border-blue-400 text-blue-400 bg-blue-400/5' : 'border-white/10 text-gray-500'}`}>CLOUD</div>
              </div>
            </div>

            <div className="p-4 sm:p-8 font-mono text-xs sm:text-sm lg:text-base leading-relaxed h-80 sm:h-96 lg:h-[360px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {lines.map((line, i) => (
                  <motion.div
                    key={`${mode}-${i}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 last:mb-0"
                  >
                    {line.label && (
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 ml-7">
                        {line.label}
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      {line.type === "success" || line.type === "info" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      ) : (
                        <span className="text-accent mt-1 shrink-0 font-bold">{">"}</span>
                      )}
                      <span className={`tracking-tight ${line.type === 'success' ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {line.text.replace("$ ", "").replace("✔ ", "")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typingIndex !== -1 && (
                <div className="flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2 ml-7">
                    {(mode === "local" ? localSteps : cloudSteps)[typingIndex].label}
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-accent mt-1 shrink-0 font-bold">{">"}</span>
                    <span className="text-white font-medium flex items-center tracking-tight">
                      {currentTypedText.replace("$ ", "")}
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-2 h-4 bg-accent ml-1" style={{ willChange: "opacity" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
