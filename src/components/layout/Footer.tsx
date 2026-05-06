"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { GithubIcon } from "@/components/ui/Icons";
import { MessageSquare, ExternalLink, ShieldCheck, Loader2, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// LinkedIn Icon Component
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);


const links = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Security Model", href: "/docs/guide/security.html" },
    { label: "Cloud Modes", href: "/docs/guide/providers/aws.html" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Installation", href: "/docs/guide/installation.html" },
    { label: "CLI Reference", href: "/docs/guide/cli.html" },
    { label: "Examples", href: "https://github.com/docker-secret-operator/dso/tree/main/examples" },
  ],
  community: [
    { label: "GitHub", href: "https://github.com/docker-secret-operator/dso", icon: GithubIcon },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mdumair250801/", icon: LinkedInIcon },
    { label: "Discord", href: "https://discord.gg/skycloudops", icon: MessageSquare },
  ]
};

export const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
  <footer className="relative pt-32 pb-16 bg-[#03070c] border-t border-white/5 overflow-hidden">
    {/* Cinematic Background Lighting */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
    <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
        
        {/* Brand Narrative Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter font-outfit">DSO</span>
          </div>
          
          <p className="text-lg text-gray-400 leading-relaxed font-medium">
            The standard for secret orchestration in high-assurance Docker environments.
          </p>
          
          <div className="pt-4 flex items-center gap-6">
            <a href="https://github.com/docker-secret-operator/dso" className="text-gray-500 hover:text-white transition-colors" title="GitHub">
              <GithubIcon className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/mdumair250801/" className="text-gray-500 hover:text-[#0A66C2] transition-colors" title="LinkedIn">
              <LinkedInIcon className="w-6 h-6" />
            </a>
            <a href="https://discord.gg/skycloudops" className="text-gray-500 hover:text-[#5865F2] transition-colors" title="Discord">
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

        {/* Link Columns */}
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

        <div className="lg:col-span-4 bg-gradient-to-br from-white/5 to-white/[0.01] border border-accent/10 rounded-3xl p-8 group hover:border-accent/30 hover:from-white/10 transition-all duration-300 shadow-lg shadow-accent/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Get updates on DSO v3.2 features, security advisories, and architecture deep-dives.
          </p>
          {showSuccess ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/30">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-emerald-400 font-medium">You are already subscribed to our Newsletter</p>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                setIsSubmitting(true);
                setShowSuccess(false);

                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });
                  if (res.ok) {
                    trackEvent.newsletterSignup(email, true);
                    form.reset();
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  } else {
                    trackEvent.newsletterSignup(email, false);
                  }
                } catch {
                  trackEvent.newsletterSignup(email, false);
                } finally {
                  setIsSubmitting(false);
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
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-background font-bold text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-gray-500 uppercase tracking-wider">
          <span>© {new Date().getFullYear()} Docker Secret Operator</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span>MIT Licensed • Open Source</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-accent/60">CNCF Landscape</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <a href="/docs/guide/security.html" className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Security <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/docs/guide/privacy.html" className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Privacy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};
