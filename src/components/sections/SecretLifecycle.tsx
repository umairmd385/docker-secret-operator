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

        {/* Stage pills */}
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
                    background: isActive ? `${s.color}14` : "transparent",
                    border: isActive
                      ? `1px solid ${s.color}40`
                      : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: isActive
                        ? `${s.color}20`
                        : "rgba(255,255,255,0.04)",
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
