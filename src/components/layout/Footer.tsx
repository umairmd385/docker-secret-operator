"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

import { DSO3DHero } from "@/components/ui/DSO3DHero";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Quick Start",  href: "#quick-start" },
  { label: "Documentation", href: "/docs" },
  { label: "GitHub",       href: "https://github.com/docker-secret-operator/dso", external: true },
];

export const Footer = () => (
  <footer className="border-t border-border bg-[#080c12] relative z-10" role="contentinfo">

    {/* ── Top nav strip ── */}
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-border/40">
      <a href="#" className="flex items-center gap-2.5 group shrink-0">
        <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Logo className="w-7 h-7" aria-hidden="true" />
        </div>
        <span className="text-base font-bold text-foreground tracking-tight">Docker Secret Operator</span>
      </a>

      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
                className="text-sm text-gray-400 hover:text-accent transition-colors duration-150 font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    {/* ── Middle row: tagline + badges ── */}
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/40">
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
        Native secret management for Docker. Built for teams running production workloads without Kubernetes.
      </p>

      <div className="flex flex-wrap items-center gap-2.5">
        {[
          { label: "MIT License",       color: "text-accent border-accent/25 bg-accent/5" },
          { label: "Zero Persistence",  color: "text-blue-400 border-blue-400/25 bg-blue-400/5" },
          { label: "Open Source",       color: "text-emerald-400 border-emerald-400/25 bg-emerald-400/5" },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wide ${color}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>

    {/* ── Legal strip ── */}
    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600 border-b border-border/30">
      <p>© {new Date().getFullYear()} Docker Secret Operator. Released under the MIT License.</p>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/docker-secret-operator/dso"
          target="_blank" rel="noreferrer"
          className="hover:text-gray-400 transition-colors"
          aria-label="View DSO on GitHub"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
        <span className="text-gray-700 font-medium tracking-tight">CNCF Sandbox Aligned</span>
      </div>
    </div>

    {/* ── Cinematic 3D DSO Wordmark ── */}
    <div className="relative overflow-hidden bg-[#080c12]" aria-hidden="true">
      {/* Label above the 3D scene */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.4em] text-accent/30 pt-10 pb-2 select-none"
      >
        Docker Secret Operator
      </motion.p>

      {/* Three.js Canvas — dynamic, no SSR */}
      <DSO3DHero />

      {/* Bottom edge accent line */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,230,192,0.25) 40%, rgba(100,220,0,0.3) 50%, rgba(0,230,192,0.25) 60%, transparent)" }}
      />
    </div>

  </footer>
);
