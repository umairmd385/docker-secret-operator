"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, GitBranch } from "lucide-react";

// SVG Logo Components
const DockerLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.49 12h3.86c.16-1.09.24-2.2.24-3.32 0-7.64-6.2-13.84-13.84-13.84-1.12 0-2.23.08-3.32.24v3.86c.76-.14 1.55-.2 2.34-.2 5.95 0 10.81 4.86 10.81 10.81 0 .79-.06 1.58-.2 2.34zm-3.5 1.5H22c0-1.19-.2-2.35-.54-3.46H14.99c-.06.76-.09 1.53-.09 2.31 0 .78.03 1.55.09 2.31zm.47 4.85c-.25-.08-.5-.16-.76-.23-.26.07-.51.15-.76.23.24.32.47.65.66.99l.1.24.1-.24c.19-.34.42-.67.66-.99zM24 9h-3.19c-.16-.73-.37-1.44-.62-2.12H24c.02.71.02 1.41 0 2.12zM2.5 24h4c-1.36-1.84-2.19-4.1-2.19-6.53 0-.95.1-1.88.29-2.78H.66c.2.9.3 1.83.3 2.78 0 2.43-.83 4.69-2.19 6.53h2.93zM24 12.5c.02-.83.02-1.66 0-2.5H20.5v2.5H24z"/>
  </svg>
);

const AWSLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 14.8c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-3.6c0-.3-.2-.5-.5-.5h-1c-.3 0-.5.2-.5.5v3.6zm3.5 0c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-3.6c0-.3-.2-.5-.5-.5h-1c-.3 0-.5.2-.5.5v3.6zm3.5 0c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-3.6c0-.3-.2-.5-.5-.5h-1c-.3 0-.5.2-.5.5v3.6z"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity="0.5"/>
  </svg>
);

const VaultLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
  </svg>
);

const AzureLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3l8 6.5L7 18h5l5-8.5L12 2H4z"/>
    <path d="M12 10l3 4H9l3-4z" opacity="0.6"/>
  </svg>
);

const HuaweiLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8h3v8H2V8zm4 0h3v8H6V8zm4 0h3v8h-3V8zm4 0h3v8h-3V8zm4 0h3v8h-3V8z"/>
  </svg>
);

const KubernetesLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" opacity="0.8"/>
    <circle cx="12" cy="8" r="1.5"/>
    <circle cx="8" cy="14" r="1.5"/>
    <circle cx="16" cy="14" r="1.5"/>
    <path d="M12 8v4M8 14v2M16 14v2M12 12h-2M12 12h2" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
  </svg>
);

export const IntegrationsMarquee = () => {
  const logos = [
    { icon: DockerLogo, label: "Docker Engine", color: "#2496ED" },
    { icon: AWSLogo, label: "AWS Secrets Manager", color: "#FF9900" },
    { icon: VaultLogo, label: "HashiCorp Vault", color: "#000000" },
    { icon: AzureLogo, label: "Azure Key Vault", color: "#0078D4" },
    { icon: KubernetesLogo, label: "Kubernetes", color: "#326CE5" },
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
