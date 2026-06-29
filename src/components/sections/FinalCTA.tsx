"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MessageSquare, Tag, FileText, GitBranch } from "lucide-react";
import { ROUTES } from "@/lib/links";

const COMMUNITY = [
  {
    icon: GitBranch,
    label: "GitHub",
    href: "https://github.com/docker-secret-operator/dso",
  },
  { icon: BookOpen, label: "Documentation", href: ROUTES.docs.root },
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
