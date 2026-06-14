'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Package, HeartPulse, RefreshCw, Trash2 } from 'lucide-react';

const ACCENT_COLOR_VAR = 'var(--color-accent)';
const ACCENT_LIGHT_VAR = 'var(--color-accent-light)';
const TEXT_PRIMARY = 'var(--color-text-primary)';
const TEXT_SECONDARY = 'var(--color-text-secondary)';
const TEXT_TERTIARY = 'var(--color-text-tertiary)';
const BORDER_DEFAULT = 'var(--color-border-default)';
const BG_SURFACE = 'var(--color-bg-secondary)';

interface Step {
  icon: typeof Eye;
  title: string;
  description: string;
  detail: string;
  timing: string;
}

const steps: Step[] = [
  {
    icon: Eye,
    title: 'Detect',
    description: 'Provider change detected',
    detail: 'Watcher polls provider or receives webhook notification of secret update',
    timing: '~1s',
  },
  {
    icon: Package,
    title: 'Spawn',
    description: 'New container created',
    detail: 'Launch container with updated secrets injected to memory via tmpfs',
    timing: 'instant',
  },
  {
    icon: HeartPulse,
    title: 'Validate',
    description: 'Health checks pass',
    detail: 'Wait for container readiness probes and health checks to signal readiness',
    timing: '~30s max',
  },
  {
    icon: RefreshCw,
    title: 'Switch',
    description: 'Atomic traffic switch',
    detail: 'Atomically rename containers using Docker CLI for instant traffic switch',
    timing: '<1ms',
  },
  {
    icon: Trash2,
    title: 'Cleanup',
    description: 'Old container removed',
    detail: 'Stop and remove old container. System ready for next rotation.',
    timing: 'instant',
  },
];

export const RotationFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, prefersReducedMotion ? 5000 : 3000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const animationDuration = prefersReducedMotion ? 0 : 0.3;

  return (
    <section id="rotation-lifecycle" className="relative bg-white border-b border-slate-100">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-8"
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            className="mb-20 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: animationDuration }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border mb-6"
              style={{
                backgroundColor: 'var(--color-accent-dim)',
                borderColor: 'var(--color-border-accent)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: animationDuration }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_COLOR_VAR }} />
              <span className="text-xs font-medium" style={{ color: ACCENT_COLOR_VAR }}>
                How It Works
              </span>
            </motion.div>

            {/* Title */}
            <h2 className="text-slate-900 mb-6">The Rotation Lifecycle</h2>

            {/* Description */}
            <p className="text-lg text-slate-600">
              From secret detection to atomic traffic switch. Every step validated before proceeding.
            </p>
          </motion.div>

          {/* Desktop: Horizontal flow */}
          <div className="hidden lg:block mb-12">
            <motion.div
              className="flex items-center justify-between gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: animationDuration }}
            >
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isActive = activeStep === idx;
                const isHovered = hoveredStep === idx;

                return (
                  <React.Fragment key={idx}>
                    {/* Step card */}
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: idx * 0.08, duration: animationDuration }}
                      onMouseEnter={() => setHoveredStep(idx)}
                      onMouseLeave={() => setHoveredStep(null)}
                      onClick={() => setActiveStep(idx)}
                    >
                      <motion.div
                        className="relative p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all h-full focus:ring-2 focus:ring-offset-2"
                        animate={{
                          borderColor: isActive || isHovered ? ACCENT_COLOR_VAR : BORDER_DEFAULT,
                          backgroundColor:
                            isActive || isHovered ? 'var(--color-accent-dim-medium)' : BG_SURFACE,
                          boxShadow:
                            isActive || isHovered
                              ? '0 8px 24px var(--color-accent-dim-strong)'
                              : '0 1px 3px var(--color-accent-dim)',
                        }}
                        whileHover={{ y: -2 }}
                      >
                        {/* Number badge */}
                        <motion.div
                          className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                          animate={{
                            backgroundColor: isActive ? ACCENT_COLOR_VAR : 'var(--color-text-disabled)',
                            scale: isActive ? 1.1 : 1,
                          }}
                        >
                          {idx + 1}
                        </motion.div>

                        {/* Icon */}
                        <motion.div
                          className="mb-4 p-3 rounded-lg w-fit"
                          animate={{
                            backgroundColor: isActive || isHovered ? ACCENT_COLOR_VAR : 'var(--color-accent-dim)',
                          }}
                        >
                          <IconComponent
                            className="w-6 h-6"
                            style={{ color: isActive || isHovered ? '#FFFFFF' : ACCENT_COLOR_VAR }}
                            strokeWidth={1.5}
                          />
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>

                        {/* Description */}
                        <p className="text-sm text-slate-700 mb-4">{step.description}</p>

                        {/* Detail - shows on active */}
                        <motion.p
                          className="text-xs mb-4 leading-relaxed"
                          style={{ color: TEXT_TERTIARY }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            height: isActive ? 'auto' : 0,
                          }}
                          transition={{ duration: animationDuration }}
                        >
                          {step.detail}
                        </motion.p>

                        {/* Timing */}
                        <motion.div
                          className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium border"
                          animate={{
                            borderColor: isActive ? ACCENT_COLOR_VAR : BORDER_DEFAULT,
                            backgroundColor: isActive ? 'var(--color-accent-dim-strong)' : 'var(--color-accent-dim)',
                            color: isActive ? ACCENT_COLOR_VAR : TEXT_TERTIARY,
                          }}
                        >
                          {step.timing}
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Connector line */}
                    {idx < steps.length - 1 && (
                      <div
                        className="flex-shrink-0 h-1 w-4 transition-all"
                        style={{
                          background:
                            activeStep > idx
                              ? 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 100%)'
                              : BORDER_DEFAULT,
                          transitionDuration: activeStep > idx ? '1.2s' : '300ms',
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile: Vertical stack */}
          <div className="lg:hidden space-y-3 mb-12">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = activeStep === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.08, duration: animationDuration }}
                  onClick={() => setActiveStep(idx)}
                  className="p-5 rounded-lg border backdrop-blur-sm cursor-pointer transition-all"
                  style={{
                    borderColor: isActive ? ACCENT_COLOR_VAR : BORDER_DEFAULT,
                    backgroundColor: isActive ? 'var(--color-accent-dim-medium)' : BG_SURFACE,
                  }}
                  whileHover={{ y: -1 }}
                >
                  <div className="flex gap-4 items-start">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      animate={{
                        backgroundColor: isActive ? ACCENT_COLOR_VAR : 'var(--color-text-disabled)',
                      }}
                    >
                      {idx + 1}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-700 mb-2">{step.description}</p>
                      <motion.p
                        className="text-xs mb-2"
                        style={{ color: TEXT_TERTIARY }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          height: isActive ? 'auto' : 0,
                        }}
                        transition={{ duration: animationDuration }}
                      >
                        {step.detail}
                      </motion.p>
                      <div className="text-xs font-mono font-medium" style={{ color: ACCENT_COLOR_VAR }}>
                        {step.timing}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: BORDER_DEFAULT }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
                width: '20%',
              }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: animationDuration, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
