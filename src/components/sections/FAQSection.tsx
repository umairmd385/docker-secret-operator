"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { H2, PLead, P, PSmall } from "@/components/ui/Typography";

export const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How much CPU and memory overhead?",
      a: "Minimal. DSO is a lightweight agent designed for Docker environments. Overhead depends on your environment; see documentation for details.",
    },
    {
      q: "How are rotations monitored?",
      a: "Via CLI (dso status, dso logs) or webhook integrations. DSO can send rotation events to your monitoring system. Full audit trail available.",
    },
    {
      q: "Does DSO support my secret provider?",
      a: "DSO supports Vault, AWS Secrets Manager, Azure Key Vault, Huawei Cloud KMS, and local encrypted vault. New providers can be contributed.",
    },
    {
      q: "Can I use DSO during deployments?",
      a: "Yes. DSO works alongside your deployment process. If both are changing containers, DSO detects the new containers and validates them. Coordinated rotation is safe.",
    },
    {
      q: "Is it open source?",
      a: "Yes. Apache 2.0 licensed. Fully auditable code on GitHub.",
    },
    {
      q: "Can I use it in production?",
      a: "Yes. DSO is production-grade. It survives crashes, maintains checkpoints, and has zero-downtime guarantees.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <H2 className="mb-4">Questions answered.</H2>
          <PLead className="text-gray-400">
            Everything you need to know about DSO.
          </PLead>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className={`w-full text-left p-5 rounded-lg border transition-all duration-300 ${
                  expandedIndex === idx
                    ? "border-accent bg-accent/5"
                    : "border-gray-800 bg-gray-900/30 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-foreground text-base">
                    {faq.q}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                      expandedIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center p-8 rounded-lg border border-gray-800 bg-gray-900/30"
        >
          <PSmall className="text-gray-400 mb-4">
            Didn't find your answer?
          </PSmall>
          <a
            href="https://github.com/docker-secret-operator/dso/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-accent hover:text-accent/80 transition-colors font-medium"
          >
            Ask on GitHub Discussions →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
