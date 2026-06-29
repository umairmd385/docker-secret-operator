"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import { GithubIcon } from "@/components/ui/Icons";
import { ExternalLink, ShieldCheck, Loader2, Check, AlertCircle } from "lucide-react";

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
import { trackEvent } from "@/lib/analytics";
import { ROUTES } from "@/lib/links";

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);

const links = {
  product: [
    { label: "Product", href: "/product" },
    { label: "Architecture", href: "/architecture" },
    { label: "Deploy", href: "/deploy" },
    { label: "Docs", href: "/docs" },
  ],
  resources: [
    { label: "GitHub", href: ROUTES.external.github },
    { label: "Discord", href: ROUTES.external.discord },
    { label: "Discussions", href: "https://github.com/docker-secret-operator/dso/discussions" },
    { label: "Issues", href: "https://github.com/docker-secret-operator/dso/issues" },
  ],
  community: [
    { label: "Community", href: "/community" },
    { label: "License", href: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE" },
    { label: "Releases", href: "https://github.com/docker-secret-operator/dso/releases" },
    { label: "Roadmap", href: "https://github.com/docker-secret-operator/dso/issues?q=is%3Aissue+is%3Aopen+label%3Aroadmap" },
  ],
  legal: [
    { label: "License", href: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE" },
    { label: "Privacy", href: ROUTES.docs.guide.privacy },
  ],
};

type FormStatus = "idle" | "submitting" | "success" | "already" | "error";

export const Footer = () => {
  const [status, setStatus] = useState<FormStatus>("idle");

  return (
  <footer className="relative pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 bg-[#03070c] border-t border-white/5 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
    <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none opacity-50" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      {/* Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 mb-12 sm:mb-16">

        {/* Brand column */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Logo size={32} className="text-accent" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter">DSO</span>
          </div>

          <p className="text-lg text-gray-400 leading-relaxed font-medium">
            The standard for secret orchestration in high-assurance Docker environments.
          </p>

          <div className="pt-4 flex items-center gap-6">
            <a href={ROUTES.external.github} className="text-gray-500 hover:text-white transition-colors" title="GitHub">
              <GithubIcon className="w-6 h-6" />
            </a>
            <a href={ROUTES.external.linkedin} className="text-gray-500 hover:text-[#0A66C2] transition-colors" title="LinkedIn">
              <LinkedInIcon className="w-6 h-6" />
            </a>
            <a href={ROUTES.external.discord} className="text-gray-500 hover:text-[#5865F2] transition-colors" title="Discord">
              <DiscordIcon className="w-6 h-6" />
            </a>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Open Source
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              Apache 2.0 licensed. Community-driven secret rotation for Docker.
            </p>
          </div>
        </div>

        {/* Product links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Product</h4>
          <ul className="space-y-4">
            {links.product.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-500 hover:text-accent transition-all duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Resources</h4>
          <ul className="space-y-4">
            {links.resources.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-500 hover:text-accent transition-all duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Community</h4>
          <ul className="space-y-4">
            {links.community.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-500 hover:text-accent transition-all duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Legal</h4>
          <ul className="space-y-4">
            {links.legal.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-500 hover:text-accent transition-all duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 sm:mb-24 lg:mb-32">

        {/* Newsletter */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.01] border border-accent/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 group hover:border-accent/30 hover:from-white/10 transition-all duration-300 shadow-lg shadow-accent/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Get DSO Updates</h4>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Receive release updates, documentation changes, provider integrations, security guidance, and community announcements.
          </p>

          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              setStatus("submitting");

              try {
                const res = await fetch("/api/newsletter/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                if (res.ok) {
                  const data = await res.json();
                  trackEvent.newsletterSignup(email, true);
                  form.reset();
                  if (data.message?.toLowerCase().includes("already")) {
                    setStatus("already");
                  } else {
                    setStatus("success");
                  }
                  setTimeout(() => setStatus("idle"), 4000);
                } else {
                  trackEvent.newsletterSignup(email, false);
                  setStatus("error");
                  setTimeout(() => setStatus("idle"), 4000);
                }
              } catch {
                trackEvent.newsletterSignup(email, false);
                setStatus("error");
                setTimeout(() => setStatus("idle"), 4000);
              }
            }}
          >
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:bg-white/5 transition-all"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-background font-bold text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {status === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "success" && <Check className="w-4 h-4" />}
                <span>
                  {status === "submitting" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
                </span>
              </span>
            </button>

            {/* Inline feedback */}
            {status === "already" && (
              <p className="flex items-center gap-2 text-xs text-accent/80 pt-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                You&apos;re already subscribed — stay tuned!
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-xs text-red-400 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-gray-500 uppercase tracking-wider">
          <span>Open Source</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span>Docker Native</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span>5 Providers</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <a href={ROUTES.docs.guide.security} className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Security <ExternalLink className="w-3 h-3" />
          </a>
          <a href={ROUTES.docs.guide.privacy} className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Privacy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};
