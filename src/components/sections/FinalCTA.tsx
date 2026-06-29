"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MessageSquare, Tag, FileText, GitBranch } from "lucide-react";
import { ROUTES } from "@/lib/links";

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const COMMUNITY = [
  {
    icon: GitBranch,
    label: "GitHub",
    href: "https://github.com/docker-secret-operator/dso",
  },
  { icon: BookOpen, label: "Docs", href: ROUTES.docs.root },
  {
    icon: DiscordIcon,
    label: "Discord",
    href: ROUTES.external.discord,
  },
  {
    icon: MessageSquare,
    label: "Discussions",
    href: "https://github.com/docker-secret-operator/dso/discussions",
  },
  {
    icon: Tag,
    label: "Releases",
    href: "https://github.com/docker-secret-operator/dso/releases",
  },
  {
    icon: FileText,
    label: "Apache 2.0",
    href: "https://github.com/docker-secret-operator/dso/blob/main/LICENSE",
  },
];

export const FinalCTA = () => {
  return (
    <section className="relative py-24 sm:py-40 overflow-hidden">
      {/* Large teal glow stage */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          style={{
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(0,230,192,0.07) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Community links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mb-20"
        >
          {COMMUNITY.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={
                href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#94A3B8" }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="font-bold tracking-tighter mb-6"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              color: "#F8FAFC",
              lineHeight: "1.05",
            }}
          >
            Start rotating secrets
            <br />
            <span
              style={{
                color: "#00E6C0",
                textShadow: "0 0 50px rgba(0,230,192,0.3)",
              }}
            >
              in minutes.
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="text-lg mb-10"
          style={{ color: "#94A3B8" }}
        >
          No manual scripts. No container restarts. No downtime.
          One command to install, one command to start.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={ROUTES.landingPages.deploy}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-base text-[#05070A] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "#00E6C0",
              boxShadow: "0 0 50px rgba(0,230,192,0.35)",
            }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={ROUTES.docs.root}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-base border transition-all duration-200 hover:border-white/30 hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "#94A3B8",
            }}
          >
            Read the docs
          </a>
        </motion.div>
      </div>
    </section>
  );
};
