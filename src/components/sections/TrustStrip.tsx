"use client";

import React from "react";
import { motion } from "framer-motion";
import { getAltTextForProvider } from "@/lib/images";

const partners = [
  { name: "Docker", logo: "https://cdn.simpleicons.org/docker/ffffff" },
  { name: "AWS", logo: "https://img.icons8.com/?size=100&id=G0CnLqqcRBXl&format=png&color=ffffff" },
  { name: "HashiCorp", logo: "https://cdn.simpleicons.org/hashicorp/ffffff" },
  { name: "Kubernetes", logo: "https://cdn.simpleicons.org/kubernetes/ffffff" },
  { name: "Azure", logo: "https://img.icons8.com/?size=100&id=81727&format=png&color=ffffff" },
  { name: "Huawei", logo: "https://cdn.simpleicons.org/huawei/ffffff" },
];

export const TrustStrip = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-r from-background via-blue-500/2 to-background border-y border-blue-500/15 overflow-hidden">
      {/* Blue telemetry vertical accents */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent opacity-60" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section heading for SEO (visually styled as subtitle) */}
        <h2 className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 font-bold mb-3 sm:mb-4 text-center">
          Native Secret Integration
        </h2>

        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="h-px w-10 sm:w-12 bg-accent/50" />
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/15 via-blue-500/20 to-emerald-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-12 lg:gap-x-16 gap-y-6 sm:gap-y-8 p-4 sm:p-6 lg:p-10 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
            {partners.map((p) => (
              <motion.div
                key={p.name}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-default transition-all duration-300 filter brightness-100 hover:brightness-150"
              >
                <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-white/10 border border-white/20 group/item hover:border-accent/50 transition-colors shadow-lg shrink-0">
                   <img
                     src={p.logo}
                     alt={getAltTextForProvider(p.name)}
                     className="w-4 sm:w-5 h-4 sm:h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                   />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-[0.05em] sm:tracking-[0.1em] uppercase group-hover/item:text-white transition-colors hidden sm:inline">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
