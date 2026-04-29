"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Terminal, CheckCircle2, ChevronRight, Shield } from "lucide-react";

const localSteps = [
  { label: "Step 1: Install DSO Local Mode", text: "$ curl -fsSL https://dso.skycloudops.in/install.sh | sudo bash", delay: 500, typing: true },
  { label: "Step 2: Initialize", text: "$ docker dso init", delay: 4000, typing: true },
  { label: "Step 3: Set Secrets", text: "$ docker dso secret set DB_PASSWORD mysecret", delay: 7000, typing: true },
  { label: "Step 4: Run Stack", text: "$ docker dso up -d", delay: 10000, typing: true },
  { text: "✔ mode detected: local (native vault)", type: "info", delay: 12500, typing: false },
];

const cloudSteps = [
  { label: "Step 1: Setup Cloud", text: "$ docker dso system setup --providers aws", delay: 500, typing: true },
  { label: "Step 2: Authenticate", text: "$ docker dso auth login aws", delay: 4000, typing: true },
  { label: "Step 3: Inject Cloud Secrets", text: "$ docker dso up", delay: 7000, typing: true },
  { text: "✔ cloud plugin: aws-secrets-manager connected", type: "success", delay: 9500, typing: false },
];

export const Hero = () => {
  const [mode, setMode] = useState<"local" | "cloud">("local");
  const [lines, setLines] = useState<{text: string, type?: string, typing: boolean, label?: string}[]>([]);
  const [typingIndex, setTypingIndex] = useState(-1);
  const [currentTypedText, setCurrentTypedText] = useState("");
  const [isPaused, setIsPaused] = useState(false);

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
                // If it's the last step of local, switch to cloud after a delay
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
          // Handle switch for non-typing last lines
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
    <section className="relative pt-20 pb-20 overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 blur-[180px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start"
          >
            <Badge variant="success" className="mb-8 px-4 py-1.5 border-accent/20 bg-accent/10 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2.5 animate-pulse" />
              v3.2 • Production Ready
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-8 font-outfit">
              Secrets for Docker. <br />
              <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-emerald-400">Start Local. Scale to Cloud.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl font-medium">
              Inject secrets at runtime without storing them on disk. Use local encrypted vaults or cloud providers with the same CLI workflow across every environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Button href="#quick-start" size="lg" className="group h-14 px-10 text-lg shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all">
                Quick Start
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/docs" variant="secondary" size="lg" className="h-14 px-10 text-lg border-white/5 bg-white/5 hover:bg-white/10">
                Documentation
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> MIT Licensed</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>Enterprise Ready</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md lg:max-w-none mx-auto lg:ml-auto"
          >
            <div className="absolute -inset-4 bg-accent/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f16]/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="ml-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    {mode === "local" ? "Native Vault Mode" : "Cloud Provider Mode"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${mode === 'local' ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-gray-500'}`}>LOCAL</div>
                   <div className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${mode === 'cloud' ? 'border-blue-400 text-blue-400 bg-blue-400/5' : 'border-white/10 text-gray-500'}`}>CLOUD</div>
                </div>
              </div>

              <div className="p-8 font-mono text-sm sm:text-base leading-relaxed h-[360px] overflow-hidden">
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
                    {mode === mode && (
                      <>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2 ml-7">
                          {(mode === "local" ? localSteps : cloudSteps)[typingIndex].label}
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="text-accent mt-1 shrink-0 font-bold">{">"}</span>
                          <span className="text-white font-medium flex items-center tracking-tight">
                            {currentTypedText.replace("$ ", "")}
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-accent ml-1" />
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
