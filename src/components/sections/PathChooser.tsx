"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Cloud, Lock, RotateCcw, Code, ChevronRight } from "lucide-react";

interface Path {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "dev" | "prod" | "offline";
  cta: string;
}

export const PathChooser = () => {
  const [selectedPath, setSelectedPath] = useState<string>("docker-compose");

  const paths: Path[] = [
    {
      id: "docker-compose",
      title: "Docker Compose",
      description: "Local development with encrypted vault. No cloud needed.",
      icon: <Code className="w-6 h-6" />,
      category: "dev",
      cta: "Start Locally",
    },
    {
      id: "aws",
      title: "AWS",
      description: "Use AWS Secrets Manager with IAM Instance Profile auth.",
      icon: <Cloud className="w-6 h-6" />,
      category: "prod",
      cta: "Configure AWS",
    },
    {
      id: "azure",
      title: "Azure",
      description: "Use Azure Key Vault with Managed Identity.",
      icon: <Cloud className="w-6 h-6" />,
      category: "prod",
      cta: "Configure Azure",
    },
    {
      id: "vault",
      title: "HashiCorp Vault",
      description: "Self-hosted or Vault Cloud with AppRole auth.",
      icon: <Lock className="w-6 h-6" />,
      category: "prod",
      cta: "Configure Vault",
    },
    {
      id: "huawei",
      title: "Huawei Cloud",
      description: "Use Huawei Cloud KMS with native authentication.",
      icon: <Cloud className="w-6 h-6" />,
      category: "prod",
      cta: "Configure Huawei",
    },
    {
      id: "offline",
      title: "Offline Mode",
      description: "Production with local encrypted vault. No cloud.",
      icon: <RotateCcw className="w-6 h-6" />,
      category: "offline",
      cta: "Go Offline",
    },
  ];

  const selectedItem = paths.find((p) => p.id === selectedPath) || paths[0];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Deploy When You're Ready
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Start locally with Docker Compose. Scale to production with AWS, Azure, Vault, or Huawei Cloud. Or run completely offline.
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {paths.map((path, idx) => (
            <motion.button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className={`text-left p-4 rounded-lg border transition-all ${
                selectedPath === path.id
                  ? "border-accent/40 bg-accent/10"
                  : "border-gray-800 bg-gray-900/20 hover:border-accent/30 hover:bg-gray-900/40"
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="text-accent">{path.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{path.title}</h3>
                  {path.category === "dev" && (
                    <span className="text-xs text-blue-400 mt-1 block">Development</span>
                  )}
                  {path.category === "prod" && (
                    <span className="text-xs text-green-400 mt-1 block">Production</span>
                  )}
                  {path.category === "offline" && (
                    <span className="text-xs text-yellow-400 mt-1 block">Offline</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">{path.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Selected Path Details */}
        <motion.div
          key={selectedPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto p-8 rounded-lg border border-accent/20 bg-accent/5 space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <div className="text-accent">{selectedItem.icon}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{selectedItem.description}</p>
              <a
                href={`#deployment-paths`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent font-medium text-sm transition-colors"
              >
                {selectedItem.cta}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
