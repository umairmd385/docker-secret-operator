"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Shield, Copy } from "lucide-react";
import { H2, H3, PLead, P, PSmall } from "@/components/ui/Typography";

export const InstallationTrust = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const installMethods = [
    {
      title: "Recommended",
      subtitle: "Verified install with checksum verification",
      recommended: true,
      steps: [
        {
          label: "Download the release",
          command: 'curl -L https://github.com/docker-secret-operator/dso/releases/download/v3.5.0/dso-v3.5.0-linux-amd64.tar.gz -o dso.tar.gz',
        },
        {
          label: "Download checksums and signatures",
          command: 'curl -L https://github.com/docker-secret-operator/dso/releases/download/v3.5.0/checksums.txt -o checksums.txt',
        },
        {
          label: "Verify checksum",
          command: 'sha256sum -c checksums.txt | grep "dso-v3.5.0-linux-amd64.tar.gz"',
        },
        {
          label: "Extract and install",
          command: 'tar -xzf dso.tar.gz && sudo mv dso /usr/local/bin/',
        },
        {
          label: "Verify installation",
          command: 'dso version',
        },
      ],
      keyPoint: "Verify authenticity before running",
    },
    {
      title: "Quick Install",
      subtitle: "For trusted environments (script-based)",
      recommended: false,
      steps: [
        {
          label: "Install",
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash",
        },
        {
          label: "Verify",
          command: "dso version",
        },
      ],
      keyPoint: "Fastest, for trusted environments only",
    },
    {
      title: "Manual Install",
      subtitle: "Full control, step by step",
      recommended: false,
      steps: [
        {
          label: "Visit releases page",
          command: "https://github.com/docker-secret-operator/dso/releases",
        },
        {
          label: "Download your platform",
          command: "dso-v3.5.0-linux-amd64.tar.gz (or your platform)",
        },
        {
          label: "Extract",
          command: "tar -xzf dso-v3.5.0-linux-amd64.tar.gz",
        },
        {
          label: "Install to PATH",
          command: "sudo mv dso /usr/local/bin/",
        },
        {
          label: "Verify",
          command: "dso version",
        },
      ],
      keyPoint: "Maximum visibility and control",
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-accent" />
            <H2>Installation Trust</H2>
          </div>
          <PLead className="text-secondary">
            DSO manages your secrets. Verify authenticity before installing. We provide multiple paths based on your security requirements.
          </PLead>
        </motion.div>

        {/* Installation Methods */}
        <div className="grid md:grid-cols-3 gap-6">
          {installMethods.map((method, methodIdx) => (
            <motion.div
              key={methodIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: methodIdx * 0.1 }}
              className={`rounded-lg border transition-all duration-300 ${
                method.recommended
                  ? "border-accent/50 bg-accent/10 ring-2 ring-accent/20"
                  : "border-border bg-surface/30"
              }`}
            >
              <div className="p-8 space-y-8">
                {/* Title */}
                <div>
                  {method.recommended && (
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide">Recommended</span>
                    </div>
                  )}
                  <H3 className="text-lg">{method.title}</H3>
                  <PSmall className="text-tertiary mt-1">{method.subtitle}</PSmall>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {method.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-tertiary">{step.label}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(step.command, methodIdx * 10 + stepIdx)}
                        className="w-full text-left p-3 rounded bg-background/50 border border-border hover:border-accent/30 hover:bg-background transition-all group"
                        title="Click to copy"
                      >
                        <code className="text-xs text-secondary/80 group-hover:text-accent transition-colors break-all font-mono">
                          {step.command}
                        </code>
                      </button>
                      {copiedIndex === methodIdx * 10 + stepIdx && (
                        <p className="text-xs text-green-400">✓ Copied</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Key Point */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-secondary/80">
                    <span className="font-semibold">Key Point:</span> {method.keyPoint}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Guidance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-6 rounded-lg border border-accent/30 bg-accent/5 p-8"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <H3 className="text-base mb-3">Why Verify?</H3>
              <div className="space-y-2 text-sm text-secondary">
                <p>
                  <span className="font-semibold">Supply Chain Security:</span> Verify checksums protect against tampered downloads and compromised mirrors.
                </p>
                <p>
                  <span className="font-semibold">Trust, Not Convenience:</span> A secrets-management tool must earn trust through safety. Verification takes 30 seconds and prevents catastrophic failures.
                </p>
                <p>
                  <span className="font-semibold">Your Responsibility:</span> You own secret rotation security. Download verification is the first step.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-border bg-surface/30 p-8 space-y-4"
        >
          <H3 className="text-base">Supported Platforms</H3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-secondary">
            {[
              "Linux (x86_64, arm64)",
              "macOS (Intel, Apple Silicon)",
              "Windows (via WSL2 or native binary)",
              "Docker containers",
            ].map((platform, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
