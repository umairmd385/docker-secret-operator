"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Archive, Cloud, FileText, Shield, ExternalLink, Terminal } from "lucide-react";
import { ROUTES } from "@/lib/links";

interface DocLink {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const DocLinkComponent = ({ icon, title, description, href, external = false, index }: DocLink & { index: number }) => {
  const Component = external ? "a" : "a";

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group p-6 rounded-lg border border-border bg-surface/30 hover:border-accent/50 hover:bg-surface/50 transition-all flex flex-col cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 group-hover:border-accent/50 group-hover:bg-accent/20 transition-all flex items-center justify-center flex-shrink-0">
          <div className="text-accent text-sm">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-base">{title}</h3>
            {external && <ExternalLink className="w-3.5 h-3.5 text-tertiary group-hover:text-accent transition-colors flex-shrink-0" />}
          </div>
        </div>
      </div>
      <p className="text-xs text-secondary">{description}</p>
    </motion.a>
  );
};

export const DocsNavigation = () => {
  const docLinks: DocLink[] = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Getting Started",
      description: "Install DSO, configure local vault, run your first rotation.",
      href: "https://github.com/docker-secret-operator/dso#quick-start",
      external: true,
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: "CLI Reference",
      description: "Complete command reference for dso init, up, down, compose, secret, and management.",
      href: ROUTES.docs.cli,
      external: false,
    },
    {
      icon: <Archive className="w-5 h-5" />,
      title: "Architecture",
      description: "How DSO works: rotation lifecycle, security model, provider integration.",
      href: "https://github.com/docker-secret-operator/dso/blob/main/docs/architecture.md",
      external: true,
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "Providers",
      description: "Configure AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or local vault.",
      href: "https://github.com/docker-secret-operator/dso/blob/main/docs/providers.md",
      external: true,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Operations",
      description: "Health checks, rollback triggers, monitoring, troubleshooting, and scaling.",
      href: "https://github.com/docker-secret-operator/dso/blob/main/docs/operations.md",
      external: true,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Security",
      description: "Security boundaries, trust assumptions, attack vectors, and mitigation.",
      href: "https://github.com/docker-secret-operator/dso/blob/main/docs/threat-model.md",
      external: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Docs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docLinks.map((link, index) => (
          <DocLinkComponent key={link.title} {...link} index={index} />
        ))}
      </div>
    </div>
  );
};
