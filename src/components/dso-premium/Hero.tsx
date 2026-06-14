'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Package, HeartPulse, RefreshCw, Trash2 } from 'lucide-react';

const RotationStep = ({ stage, isActive }: { stage: number; isActive: boolean }) => {
  const stages = [
    { icon: Eye, label: 'Secret detected' },
    { icon: Package, label: 'Container spawned' },
    { icon: HeartPulse, label: 'Health validated' },
    { icon: RefreshCw, label: 'Traffic switched' },
    { icon: Trash2, label: 'Old cleaned up' },
  ];

  const StageIcon = stages[stage]?.icon || Eye;
  const Icon = StageIcon as any;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={{ opacity: isActive ? 1 : 0.4 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: isActive ? 'var(--color-accent)' : 'var(--color-accent-dim)',
          border: `2px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border-default)'}`,
        }}
        animate={{ scale: isActive ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          className="w-7 h-7"
          style={{ color: isActive ? '#FFFFFF' : 'var(--color-accent)' }}
          strokeWidth={1.5}
        />
      </motion.div>
      {isActive && (
        <motion.p
          className="text-xs font-semibold text-center text-slate-900 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {stages[stage].label}
        </motion.p>
      )}
    </motion.div>
  );
};

export const Hero = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-40 right-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-8"
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)' }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero padding: generous spacing on top/bottom */}
        <div className="py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Grid: better responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* LEFT: Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col gap-8"
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border w-fit"
                  style={{
                    backgroundColor: 'var(--color-accent-dim)',
                    borderColor: 'var(--color-border-accent-light)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                    Docker Native • CNCF Sandbox
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h1 className="font-black text-slate-900 leading-tight">
                    Rotate Secrets
                    <br />
                    <span style={{ color: 'var(--color-accent)' }}>Without Downtime</span>
                  </h1>
                  <p className="text-lg leading-relaxed text-slate-600 max-w-lg">
                    Zero-downtime secret rotation for Docker Compose and production workloads. Detect changes, spawn containers, validate health, swap traffic atomically.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <a
                    href="https://github.com/docker-secret-operator/dso"
                    className="px-6 py-3 rounded-lg font-semibold text-white text-center transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      boxShadow: '0 10px 25px var(--color-accent-dim-strong)',
                    }}
                  >
                    Get Started
                  </a>
                  <a
                    href="#rotation-lifecycle"
                    className="px-6 py-3 rounded-lg font-semibold border-2 text-center transition-all duration-200 hover:bg-opacity-100 active:scale-95"
                    style={{
                      color: 'var(--color-accent)',
                      borderColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-accent-dim)',
                    }}
                  >
                    Learn How
                  </a>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="space-y-3 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    <span><strong>Apache 2.0</strong> open source</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    <span>Production-grade reliability</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* RIGHT: Rotation Flow Animation */}
              <motion.div
                className="relative flex items-center justify-center lg:min-h-96"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="relative w-full max-w-sm">
                  {/* Vertical rotation pipeline */}
                  <div className="flex flex-col items-center gap-6 py-8">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <div key={idx} className="relative w-full flex justify-center">
                        {/* Connector line */}
                        {idx < 4 && (
                          <motion.div
                            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-12"
                            style={{
                              background:
                                activeStage > idx
                                  ? 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-light) 100%)'
                                  : 'var(--color-border-default)',
                            }}
                            animate={{
                              background:
                                activeStage > idx
                                  ? ['linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-light) 100%)', 'linear-gradient(180deg, var(--color-accent-light) 0%, var(--color-accent) 100%)', 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-light) 100%)']
                                  : 'var(--color-border-default)',
                            }}
                            transition={{
                              duration: activeStage > idx ? 1.2 : 0.3,
                              repeat: activeStage > idx ? Infinity : 0,
                            }}
                          />
                        )}
                        <RotationStep stage={idx} isActive={activeStage === idx} />
                      </div>
                    ))}
                  </div>

                  {/* Progress bar at bottom */}
                  <motion.div
                    className="mt-8 h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--color-border-default)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
                        width: '20%',
                      }}
                      animate={{ width: `${((activeStage + 1) / 5) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 hidden lg:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <p className="text-xs uppercase tracking-widest font-medium text-slate-500">Scroll to explore</p>
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};
