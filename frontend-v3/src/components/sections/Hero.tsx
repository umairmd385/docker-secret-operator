"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Terminal, CheckCircle2, ChevronRight } from "lucide-react";

const terminalSteps = [
  { text: "$ docker dso validate -c dso.yaml", delay: 500, typing: true },
  { text: "✔ config valid. mapped providers: [aws, vault]", type: "success", delay: 2500, typing: false },
  { text: "$ docker dso up -c dso.yaml -f docker-compose.yml -d", delay: 3500, typing: true },
  { text: "✔ provider 'aws' synced successfully", type: "success", delay: 6500, typing: false },
  { text: "✔ agent launched in background [pid: 4122]", type: "info", delay: 6000, typing: false },
  { text: "✔ stack deployed with zero restarts", type: "success", delay: 6500, typing: false },
];

export const Hero = () => {
  const [lines, setLines] = useState<{text: string, type?: string, typing: boolean}[]>([]);
  const [typingIndex, setTypingIndex] = useState(-1);
  const [currentTypedText, setCurrentTypedText] = useState("");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    terminalSteps.forEach((step, index) => {
      const t = setTimeout(() => {
        if (step.typing) {
          setTypingIndex(index);
          setCurrentTypedText("");
          // Simulate typing with random variance
          let i = 0;
          const typeChar = () => {
             setCurrentTypedText(step.text.slice(0, i));
             i++;
             if (i > step.text.length) {
                setLines(prev => [...prev, step]);
                setTypingIndex(-1);
             } else {
                const typingDelay = Math.random() * 40 + 20; // 20 to 60ms variable delay
                const charTime = setTimeout(typeChar, typingDelay);
                timeouts.push(charTime);
             }
          };
          typeChar();
        } else {
          setLines(prev => [...prev, step]);
        }
      }, step.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-accent/5 via-accent/2 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-start"
          >
            <Badge variant="success" className="mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              v3.1 Native Secret Plugin
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans tracking-tight leading-[1.1] text-foreground mb-6">
              Secret Lifecycle Management for <span className="text-accent">Docker.</span>
            </h1>
            
            <p className="text-lg text-gray-400 leading-relaxed mb-3 max-w-xl">
              Inject secrets into Docker containers at runtime — without storing them on disk or restarting services.
            </p>
            <p className="text-sm font-mono tracking-wide text-accent/70 mb-10">
              No files. No leaks. No restarts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button href="#quick-start" size="lg" className="group" aria-label="Jump to Quick Start installation guide">
                Quick Start
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/docs" variant="secondary" size="lg" aria-label="Open DSO documentation">
                Read Documentation
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 font-mono">Open Source • MIT Licensed • Works with AWS, Vault, Azure</p>
          </motion.div>

          {/* Right: Terminal Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden border border-border bg-[#0a0f16] shadow-2xl">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-2 text-xs font-mono text-gray-500">bash — docker dso</div>
              </div>

              {/* Terminal Content */}
              <div
                className="p-5 font-mono text-sm leading-relaxed min-h-[300px]"
                role="log"
                aria-live="polite"
                aria-label="DSO terminal demo"
              >
                {lines.map((line, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className="mb-2"
                  >
                    {line.type === "success" || line.type === "info" ? (
                      <span className="flex items-start gap-3 opacity-95">
                        {line.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        )}
                        <span className={line.type === "success" ? "text-emerald-400/90 font-medium" : "text-blue-400/90"}>
                          {line.text.replace("✔ ", "")}
                        </span>
                      </span>
                    ) : (
                      <div className="flex items-start gap-3">
                        <span className="text-accent mt-0.5 shrink-0">{"$"}</span>
                        <span className="text-gray-200">{line.text.replace("$ ", "")}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Active Typing Line */}
                {typingIndex !== -1 && (
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-accent mt-0.5 shrink-0">{"$"}</span>
                    <span className="text-gray-100 font-semibold flex items-center">
                      {currentTypedText.replace("$ ", "")}
                      <motion.span 
                        animate={{ opacity: [1, 0, 1] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2.5 h-4 bg-accent inline-block ml-1"
                      />
                    </span>
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
