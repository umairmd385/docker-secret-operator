"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, HardDrive, Container, Lock, Shield } from "lucide-react";

interface SecurityBoundariesProps {
  variant?: "compact" | "detailed";
  className?: string;
}

const TrustZone = ({
  icon: Icon,
  title,
  items,
  color,
  borderColor,
  bgColor,
  index,
}: {
  icon: any;
  title: string;
  items: string[];
  color: string;
  borderColor: string;
  bgColor: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${borderColor} ${bgColor} relative overflow-hidden`}
  >
    {/* Background glow */}
    <div
      className={`absolute inset-0 opacity-5 pointer-events-none`}
      style={{
        background: `radial-gradient(circle at center, currentColor)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color}/10 border ${color}/30 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
        </div>
        <h4 className={`text-base sm:text-lg font-bold ${color}`}>
          {title}
        </h4>
      </div>

      {/* Items list */}
      <ul className="space-y-2 sm:space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

export const SecurityBoundaries = ({
  variant = "detailed",
  className = "",
}: SecurityBoundariesProps) => {
  const zones = [
    {
      icon: Cloud,
      title: "Cloud Boundary",
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      items: [
        "AWS Secrets Manager / Azure Key Vault / HashiCorp Vault",
        "Encrypted at rest by provider",
        "TLS 1.3 encryption in transit",
        "Machine identity authentication",
      ],
    },
    {
      icon: HardDrive,
      title: "Host Boundary",
      color: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/5",
      items: [
        "dso-agent daemon (systemd service)",
        "Secrets in locked memory (mlock)",
        "Unix socket isolation (/run/dso/dso.sock)",
        "No disk persistence",
      ],
    },
    {
      icon: Container,
      title: "Container Sandbox",
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgColor: "bg-cyan-500/5",
      items: [
        "tmpfs mount (/run/secrets/)",
        "Secrets in RAM only",
        "Isolated namespace",
        "Auto-cleanup on container stop",
      ],
    },
  ];

  return (
    <section className={`w-full bg-background ${className}`}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Defense in Depth
          </h2>
        </div>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Three layers of isolation prevent secrets from reaching untrusted boundaries.
        </p>
      </motion.div>

      {/* Desktop: 3-column grid */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {zones.map((zone, idx) => (
          <TrustZone
            key={idx}
            icon={zone.icon}
            title={zone.title}
            items={zone.items}
            color={zone.color}
            borderColor={zone.borderColor}
            bgColor={zone.bgColor}
            index={idx}
          />
        ))}
      </div>

      {/* Mobile: stacked */}
      <div className="sm:hidden flex flex-col gap-4">
        {zones.map((zone, idx) => (
          <TrustZone
            key={idx}
            icon={zone.icon}
            title={zone.title}
            items={zone.items}
            color={zone.color}
            borderColor={zone.borderColor}
            bgColor={zone.bgColor}
            index={idx}
          />
        ))}
      </div>

      {/* Bottom: security guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45 }}
        className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-accent/20 bg-accent/5"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1">
              Zero-Persistence Guarantee
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm">
              Plaintext secrets never touch your host filesystem. If the machine loses power or crashes, all secrets vanish instantly with no forensic trace.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
