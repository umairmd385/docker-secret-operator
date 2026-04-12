import React from "react";
import { Copy, BookOpen } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

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
  <footer className="border-t border-border bg-[#080c12]" role="contentinfo">

    {/* ── Top nav strip ── */}
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-border/40">

      {/* Brand */}
      <a href="#" className="flex items-center gap-2.5 group shrink-0">
        <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Logo className="w-7 h-7" aria-hidden="true" />
        </div>
        <span className="text-base font-bold text-foreground tracking-tight">Docker Secret Operator</span>
      </a>

      {/* Nav links */}
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
        <a href="https://github.com/docker-secret-operator/dso" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors" aria-label="View DSO on GitHub">
          <GithubIcon className="w-4 h-4" />
        </a>
        <span className="text-gray-700">CNCF Sandbox Aligned</span>
      </div>
    </div>

    {/* ── KongHQ-style large wordmark ── */}
    <div className="relative overflow-hidden select-none" aria-hidden="true">
      {/* Radial glow behind wordmark */}
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-accent/8 blur-[120px] rounded-full pointer-events-none" />

      <p
        className="text-center font-black uppercase tracking-[-0.04em] leading-none"
        style={{
          fontSize: "clamp(5rem, 20vw, 18rem)",
          WebkitTextStroke: "1px rgba(0,230,192,0.18)",
          color: "transparent",
          backgroundImage: "linear-gradient(180deg, rgba(0,230,192,0.12) 0%, rgba(0,230,192,0.03) 60%, transparent 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          paddingBottom: "0.05em",
        }}
      >
        DSO
      </p>
    </div>

  </footer>
);
