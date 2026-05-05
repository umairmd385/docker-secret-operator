"use client";

import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { GithubIcon, TwitterIcon } from "@/components/ui/Icons";
import { MessageSquare, ExternalLink, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const links = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Security", href: "/docs/security" },
    { label: "Cloud Modes", href: "/docs/cloud" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Installation", href: "/docs/guide/installation" },
    { label: "CLI Reference", href: "/docs/guide/cli" },
    { label: "Examples", href: "https://github.com/docker-secret-operator/dso/tree/main/examples" },
  ],
  community: [
    { label: "GitHub", href: "https://github.com/docker-secret-operator/dso", icon: GithubIcon },
    { label: "Twitter / X", href: "https://x.com/skycloudops", icon: TwitterIcon },
    { label: "Discord", href: "https://discord.gg/skycloudops", icon: MessageSquare },
  ]
};

export const Footer = () => (
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
            <a href="https://x.com/skycloudops" className="text-gray-500 hover:text-[#1DA1F2] transition-colors" title="Twitter / X">
              <TwitterIcon className="w-6 h-6" />
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
          <form 
            className="space-y-4" 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              const btn = form.querySelector('button');
              if (btn) btn.disabled = true;

              try {
                const res = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                if (res.ok) {
                  trackEvent.newsletterSignup(email, true);
                  alert('Welcome to the community! Check your inbox.');
                  form.reset();
                } else {
                  trackEvent.newsletterSignup(email, false);
                  alert('Something went wrong. Please try again.');
                }
              } catch (err) {
                trackEvent.newsletterSignup(email, false);
                alert('Network error. Please try again.');
              } finally {
                if (btn) btn.disabled = false;
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
            <button type="submit" className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-background font-bold text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Subscribe
            </button>
          </form>
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
          <a href="/docs/guide/security" className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Security <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/docs/guide/privacy" className="text-gray-500 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            Privacy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);
