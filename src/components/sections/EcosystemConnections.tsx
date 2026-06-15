"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Package, Shield } from "lucide-react";

export const EcosystemConnections = () => {
  const connections = [
    {
      category: "Secret Storage",
      items: [
        { name: "HashiCorp Vault", description: "Enterprise secret management", link: "https://www.vaultproject.io/" },
        { name: "AWS Secrets Manager", description: "AWS-native secrets service", link: "https://aws.amazon.com/secrets-manager/" },
        { name: "Azure Key Vault", description: "Azure secrets and key management", link: "https://azure.microsoft.com/en-us/products/key-vault" },
      ]
    },
    {
      category: "Container Orchestration",
      items: [
        { name: "Docker", description: "Container runtime and CLI", link: "https://www.docker.com/" },
        { name: "Docker Compose", description: "Multi-container application orchestration", link: "https://docs.docker.com/compose/" },
      ]
    },
    {
      category: "Monitoring & Observability",
      items: [
        { name: "Prometheus", description: "Metrics collection and monitoring", link: "https://prometheus.io/" },
        { name: "OpenTelemetry", description: "Standardized observability", link: "https://opentelemetry.io/" },
      ]
    },
    {
      category: "Standards & Community",
      items: [
        { name: "CNCF", description: "Cloud Native Computing Foundation", link: "https://www.cncf.io/" },
        { name: "Docker Community", description: "Open source Docker initiatives", link: "https://www.docker.com/community/" },
      ]
    }
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Ecosystem & Integration
          </h2>
          <p className="text-lg text-gray-400">
            DSO integrates seamlessly with the tools you already use.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8">
          {connections.map((section, sidx) => (
            <motion.div
              key={sidx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sidx * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                {sidx === 0 && <Shield className="w-5 h-5 text-accent" />}
                {sidx === 1 && <Package className="w-5 h-5 text-accent" />}
                {sidx === 2 && <GitBranch className="w-5 h-5 text-accent" />}
                {sidx === 3 && <ExternalLink className="w-5 h-5 text-accent" />}
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-accent/30 hover:bg-gray-900/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-accent flex-shrink-0 mt-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-lg border border-accent/20 bg-accent/5"
        >
          <h3 className="font-semibold text-foreground text-lg mb-3">Not Limited to These</h3>
          <p className="text-sm text-gray-300">
            DSO works with any tool that can store secrets and any container runtime compatible with Docker. Check our documentation for provider-specific guides and integration examples.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
