"use client";

import React, { useState } from "react";
import { DSOLogoIcon } from "@/components/branding/DSOLogo";
import { GithubIcon } from "@/components/ui/Icons";
import { MessageSquare, ExternalLink, ShieldCheck, Loader2, Check, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { ROUTES } from "@/lib/links";

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);

const links = {
  product: [
    { label: "Features", href: ROUTES.anchors.features },
    { label: "Integrations", href: "/integrations" },
    { label: "Comparisons", href: "/comparisons" },
    { label: "Architecture", href: ROUTES.anchors.architecture },
  ],
  resources: [
    { label: "Documentation", href: ROUTES.docs.root },
    { label: "Examples", href: "/examples" },
    { label: "Quick Start", href: ROUTES.anchors.quickStart },
    { label: "FAQ", href: "/faq" },
  ],
  security: [
    { label: "Security Model", href: ROUTES.docs.guide.security },
    { label: "Cloud Providers", href: ROUTES.docs.guide.providers.aws },
    { label: "Privacy Policy", href: ROUTES.docs.guide.privacy },
    { label: "Report Vulnerability", href: "/security" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 mb-16 sm:mb-24 lg:mb-32">

        {/* Brand column */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <DSOLogoIcon size="sm" darkMode={true} />
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
              <MessageSquare className="w-6 h-6" />
            </a>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Production Validated
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              Securing 100k+ container secrets across enterprise clusters.
            </p>
          </div>
        </div>

        {/* Product links */}
        <div className="lg:col-span-2 lg:ml-auto">
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

        {/* Security links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Security</h4>
          <ul className="space-y-4">
            {links.security.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-500 hover:text-accent transition-all duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-3 bg-gradient-to-br from-white/5 to-white/[0.01] border border-accent/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 group hover:border-accent/30 hover:from-white/10 transition-all duration-300 shadow-lg shadow-accent/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Get updates on DSO v3.2 features, security advisories, and architecture deep-dives.
          </p>

          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              setStatus("submitting");

              try {
                const res = await fetch("/api/newsletter", {
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
              placeholder="your.email@company.com"
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
          <span>© {new Date().getFullYear()} Docker Secret Operator</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span>Apache 2.0 Licensed • Open Source</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-accent/60">CNCF Sandbox</span>
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
