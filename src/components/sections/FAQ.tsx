"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQCard = ({ question, answer, isOpen, onClick, index }: FAQItem & { isOpen: boolean; onClick: () => void; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="border border-gray-800 rounded-lg bg-gray-900/30 hover:border-accent/30 transition-colors"
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-900/50 transition-colors"
    >
      <h3 className="font-semibold text-foreground text-sm sm:text-base">{question}</h3>
      <ChevronDown
        className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border-t border-gray-800"
    >
      <p className="px-6 py-4 text-sm text-gray-400 leading-relaxed">{answer}</p>
    </motion.div>
  </motion.div>
);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: "Platform Support",
      question: "Does DSO work with Kubernetes?",
      answer:
        "No. DSO is designed for Docker Compose and single-host Docker deployments. For Kubernetes workloads, use Kubernetes-native secret management like Sealed Secrets, External Secrets Operator, or HashiCorp Vault.",
    },
    {
      category: "Platform Support",
      question: "Can I use DSO with Docker Swarm?",
      answer:
        "No. DSO focuses on Docker Compose and single-host deployments. For multi-host orchestration, Kubernetes and its native secret management tools are the standard approach.",
    },
    {
      category: "How It Works",
      question: "What happens if rotation fails? Can you rollback?",
      answer:
        "Yes. If a health check fails during rotation, DSO automatically rolls back to the previous container. The old container is never stopped until the new one is fully healthy and validated. No downtime, even on failure.",
    },
    {
      category: "Offline",
      question: "Can DSO work completely offline without cloud providers?",
      answer:
        "Absolutely. Use Local Encrypted Vault mode. DSO creates an encrypted vault on your system (/etc/dso/vault.enc) and rotates secrets locally. No cloud dependencies. Perfect for air-gapped environments or isolated servers.",
    },
    {
      category: "Local Development",
      question: "Do I need a cloud account to start locally with Docker Compose?",
      answer:
        "No. Local development uses Docker Compose with an encrypted local vault. No cloud account or external provider required. Perfect for trying DSO and for full development workflows.",
    },
    {
      category: "Implementation",
      question: "Where do rotated secrets live?",
      answer:
        "Secrets are streamed to container tmpfs (memory-based filesystem) via Docker API. They are not persisted to disk. On container stop, memory is released. Vault itself is encrypted at rest.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Answers to common questions about DSO, deployment, and features.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <FAQCard
              key={idx}
              {...item}
              index={idx}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-5 rounded-lg border border-gray-800 bg-gray-900/30 text-center"
        >
          <p className="text-sm text-gray-400">
            More questions?{" "}
            <a
              href="https://github.com/docker-secret-operator/dso/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Start a discussion on GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
