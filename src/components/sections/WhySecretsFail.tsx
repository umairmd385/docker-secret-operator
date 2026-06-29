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

        <div className="relative max-w-3xl mx-auto">
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
              rotation entirely — leaving secrets unchanged for months. That&apos;s
              worse.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
