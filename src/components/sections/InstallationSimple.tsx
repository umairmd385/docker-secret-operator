"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronRight } from "lucide-react";
import { Code, Lock, Cloud, RotateCcw } from "lucide-react";

export const InstallationSimple = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const paths = [
    {
      id: "compose",
      icon: <Code className="w-5 h-5" />,
      title: "Docker Compose",
      subtitle: "Local development",
      command: "curl -fsSL https://dso.sh/install | bash",
      steps: [
        "Install DSO CLI",
        "Initialize local vault",
        "Add secrets",
        "Run compose with DSO",
      ],
    },
    {
      id: "aws",
      icon: <Cloud className="w-5 h-5" />,
      title: "AWS Secrets Manager",
      subtitle: "Production on AWS",
      command: "dso bootstrap --provider aws --region us-east-1",
      steps: [
        "Install DSO system-wide",
        "Configure AWS provider",
        "Start DSO agent",
        "Verify connection",
      ],
    },
    {
      id: "vault",
      icon: <Lock className="w-5 h-5" />,
      title: "HashiCorp Vault",
      subtitle: "Self-hosted or cloud",
      command: "dso bootstrap --provider vault --address http://vault:8200",
      steps: [
        "Install DSO system-wide",
        "Configure Vault auth",
        "Start DSO agent",
        "Verify connection",
      ],
    },
    {
      id: "local",
      icon: <RotateCcw className="w-5 h-5" />,
      title: "Production Local",
      subtitle: "Without cloud dependencies",
      command: "dso init --vault-path /etc/dso/vault.enc",
      steps: [
        "Install DSO system-wide",
        "Initialize encrypted vault",
        "Add production secrets",
        "Start DSO agent",
      ],
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Installation made simple.
          </h2>
          <p className="text-lg text-gray-400">
            Start with Docker Compose. Scale to production.
          </p>
        </motion.div>

        {/* Installation paths grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {paths.map((path, idx) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
              whileHover={{ y: -4 }}
              className={`text-left p-5 rounded-lg border-2 transition-all duration-300 group ${
                expandedPath === path.id
                  ? "border-accent bg-accent/10"
                  : "border-gray-800 bg-gray-900/30 hover:border-accent/50"
              }`}
            >
              <div className={`text-accent mb-3 transition-colors ${expandedPath === path.id ? "text-accent" : "text-gray-500 group-hover:text-accent"}`}>
                {path.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {path.title}
              </h3>
              <p className="text-xs text-gray-500">{path.subtitle}</p>
              <ChevronRight className={`w-4 h-4 text-gray-500 mt-3 transition-transform ${expandedPath === path.id ? "rotate-90" : ""}`} />
            </motion.button>
          ))}
        </div>

        {/* Expanded path details */}
        {expandedPath && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 p-8 rounded-lg border border-gray-800 bg-gray-900/50"
          >
            {paths.find((p) => p.id === expandedPath) && (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  {paths.find((p) => p.id === expandedPath)?.title}
                </h3>

                {/* Command */}
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">First command:</p>
                  <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded p-4">
                    <code className="flex-1 text-sm font-mono text-accent break-all">
                      {paths.find((p) => p.id === expandedPath)?.command}
                    </code>
                    <button
                      onClick={() =>
                        copyCommand(
                          paths.find((p) => p.id === expandedPath)?.command || "",
                          expandedPath
                        )
                      }
                      className="p-2 hover:bg-gray-800 rounded transition-colors"
                    >
                      {copied === expandedPath ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <p className="text-sm text-gray-400 mb-3">Setup steps:</p>
                  <ol className="space-y-2">
                    {paths
                      .find((p) => p.id === expandedPath)
                      ?.steps.map((step, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                  </ol>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <a
            href="https://github.com/docker-secret-operator/dso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-lg bg-accent text-background font-semibold hover:bg-accent/90 transition-colors duration-200"
          >
            View Full Documentation
          </a>
        </motion.div>
      </div>
    </section>
  );
};
