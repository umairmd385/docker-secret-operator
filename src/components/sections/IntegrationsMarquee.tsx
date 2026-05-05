"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, GitBranch } from "lucide-react";

// Brand logos as SVG components
const DockerLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7 4.33c-.77-1.36-2.34-2.14-3.94-2.14-2.25 0-4.24 1.67-4.58 3.83H3c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7.02c0-.55-.45-1-1-1h-2.38c-.34-2.16-2.33-3.83-4.58-3.83-1.6 0-3.17.78-3.94 2.14zM9.76 4.33c.27-.79.89-1.44 1.64-1.78.37-.17.79-.22 1.21-.22.42 0 .84.05 1.21.22.75.34 1.37.99 1.64 1.78H9.76zm3.24 13.67c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/>
  </svg>
);

const AWSLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8l5-3 5 3v4l-5 3-5-3V8z" fill="currentColor" opacity="0.8"/>
    <path d="M7 12l5 3 5-3" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="16" width="18" height="4" rx="0.5" fill="currentColor" opacity="0.4"/>
  </svg>
);

const VaultLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" opacity="0.2"/>
    <path d="M12 3C6.48 3 2 6.58 2 11v8.5h20V11c0-4.42-4.48-8-10-8zm0 2c3.86 0 7 2.69 7 6s-3.14 6-7 6-7-2.69-7-6 3.14-6 7-6zm0 2c-2.21 0-4 1.34-4 3s1.79 3 4 3 4-1.34 4-3-1.79-3-4-3z"/>
  </svg>
);

const AzureLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h8l6 8H9l6 8H3z" opacity="0.8"/>
    <path d="M6 10h6l-2 3h-4z" fill="currentColor" opacity="0.5"/>
  </svg>
);

const HuaweiLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="4" height="12" />
    <rect x="8" y="4" width="4" height="14" />
    <rect x="14" y="6" width="4" height="12" />
    <rect x="20" y="8" width="2" height="8" />
  </svg>
);

export const IntegrationsMarquee = () => {
  const logos = [
    { icon: DockerLogo, label: "Docker Engine", color: "#2496ED" },
    { icon: AWSLogo, label: "AWS Secrets Manager", color: "#FF9900" },
    { icon: VaultLogo, label: "HashiCorp Vault", color: "#000000" },
    { icon: AzureLogo, label: "Azure Key Vault", color: "#0078D4" },
    { icon: HuaweiLogo, label: "Huawei Cloud CSMS", color: "#EE3124" },
  ];

  // duplicate for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section id="integrations" className="py-24 overflow-hidden border-b border-border bg-surface2/30">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h3 className="text-xl font-bold text-foreground mb-2">Works with your existing secret providers</h3>
        <p className="text-gray-400 text-sm mb-8">Via the extensible Go plugin architecture</p>

        {/* Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { icon: ShieldCheck, label: "Zero Disk Persistence" },
            { icon: Zap, label: "Event-Driven" },
            { icon: GitBranch, label: "Checksum Verified" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent/80 text-xs font-mono tracking-wide">
              <Icon className="w-3 h-3" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-7xl flex flex-col items-center mx-auto overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex">
          <motion.div
            className="flex gap-16 pr-16 items-center"
            animate={{ x: ["0%", "-33.333333%"] }}
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity,
            }}
          >
            {duplicatedLogos.map((logo, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-500 shrink-0 hover:text-accent transition-colors duration-300">
                <div className="flex items-center justify-center w-8 h-8">
                  <logo.icon />
                </div>
                <span className="font-bold text-sm whitespace-nowrap">{logo.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
