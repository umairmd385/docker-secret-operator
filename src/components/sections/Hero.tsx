"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronRight, CheckCircle2, Eye, Package, HeartPulse, RefreshCw, Trash2, Lock, Cloud, Key, HardDrive } from "lucide-react";
import { ROUTES } from "@/lib/links";

const ProviderIcon = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/40 border border-gray-700/50 hover:border-accent/50 hover:bg-gray-900/60 transition-all duration-200">
    <Icon className="w-4 h-4 text-accent" />
    <span className="text-sm text-gray-300">{label}</span>
  </div>
);

const RotationFlowStep = ({
  icon: Icon,
  label,
  delay
}: {
  icon: any;
  label: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-center gap-3"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  </motion.div>
);

export const Hero = () => {
  const steps = [
    { icon: Eye, label: "Detect change", delay: 0 },
    { icon: Package, label: "Spawn container", delay: 0.1 },
    { icon: HeartPulse, label: "Validate health", delay: 0.2 },
    { icon: RefreshCw, label: "Swap traffic", delay: 0.3 },
    { icon: Trash2, label: "Cleanup", delay: 0.4 },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-background border-b border-gray-800 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-2xl"
          >
            {/* Badge Row */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent uppercase tracking-widest">
                Docker Native
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent uppercase tracking-widest">
                Open Source
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent uppercase tracking-widest">
                CNCF Sandbox
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent uppercase tracking-widest">
                5+ Providers
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Rotate Secrets
                <br />
                <span className="text-accent text-4xl sm:text-5xl lg:text-6xl">Without Downtime</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-400 mt-4 font-medium">
                For Docker teams running production workloads
              </p>
            </div>

            {/* Subheading - The Pain Point */}
            <div className="space-y-3">
              <p className="text-lg text-gray-300 font-medium">
                Secret rotation today means manual scripts, container restarts, and downtime risk.
              </p>
              <p className="text-base text-gray-400 leading-relaxed">
                DSO eliminates that. Detect secret changes automatically. Launch health-checked containers. Validate readiness before swap.
                <br />
                Traffic switches safely. Rollback instantly on failure.
                <br />
                <span className="text-gray-300 font-medium">No manual intervention. No restart overhead. No downtime.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  href={ROUTES.landingPages.deploy}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors text-base"
                >
                  Deploy DSO
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
              <Button
                href={ROUTES.docs.root}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4"
              >
                Documentation
              </Button>
            </div>

            {/* Technical Capabilities Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-2 pt-4"
            >
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-700 text-xs text-gray-400 font-medium">
                Rolling Updates
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-700 text-xs text-gray-400 font-medium">
                Auto Recovery
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-700 text-xs text-gray-400 font-medium">
                Health Checks
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-700 text-xs text-gray-400 font-medium">
                Rollback
              </span>
            </motion.div>

            {/* Provider Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="pt-8 border-t border-gray-800 space-y-3"
            >
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Works with
              </p>
              <div className="flex flex-wrap gap-2">
                <ProviderIcon icon={Cloud} label="AWS Secrets Manager" />
                <ProviderIcon icon={Key} label="Azure Key Vault" />
                <ProviderIcon icon={Lock} label="HashiCorp Vault" />
                <ProviderIcon icon={HardDrive} label="Local Vault" />
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="space-y-4">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
                Rotation Process
              </p>
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <RotationFlowStep
                    icon={step.icon}
                    label={step.label}
                    delay={step.delay}
                  />
                  {idx < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: step.delay + 0.15, duration: 0.4 }}
                      className="h-6 pl-5 flex items-center text-gray-700"
                    >
                      <div className="w-0.5 h-4 bg-gradient-to-b from-accent/40 to-transparent" />
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Recovery Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-6 p-3 rounded-lg border border-green-500/15 bg-green-500/3"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-400">
                    <p className="font-medium text-gray-300">Automatic Rollback</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Failed rotations recover instantly.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Stacked Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:hidden mt-12 pt-12 border-t border-gray-800 space-y-4"
        >
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
            Rotation Process
          </p>
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-2">
              <RotationFlowStep
                icon={step.icon}
                label={step.label}
                delay={step.delay}
              />
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step.delay + 0.15, duration: 0.4 }}
                  className="h-6 pl-5 flex items-center text-gray-700"
                >
                  <div className="w-0.5 h-4 bg-gradient-to-b from-accent/40 to-transparent" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
