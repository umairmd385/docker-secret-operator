"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <section className="py-16 bg-background relative border-y border-white/5 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">
            Native Secret Integration
          </p>
          <div className="h-px w-12 bg-accent/50" />
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex flex-wrap justify-center items-center gap-x-16 gap-y-10 p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
            {partners.map((p) => (
              <motion.div 
                key={p.name}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-4 cursor-default transition-all duration-300 filter brightness-100 hover:brightness-150"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 group/item hover:border-accent/50 transition-colors shadow-lg">
                   <img 
                     src={p.logo} 
                     alt={p.name} 
                     className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                   />
                </div>
                <span className="text-xs font-bold text-gray-400 tracking-[0.1em] uppercase group-hover/item:text-white transition-colors">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
