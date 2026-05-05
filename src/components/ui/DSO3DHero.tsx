"use client";

import React from "react";
import { motion } from "framer-motion";

interface DSO3DHeroProps {
  className?: string;
}

export function DSO3DHero({ className = "" }: DSO3DHeroProps) {
  return (
    <section 
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center py-16 sm:py-24 ${className}`}
      style={{ 
        minHeight: "400px",
        background: "linear-gradient(180deg, #020617 0%, rgba(3, 18, 10, 0.4) 100%)",
      }}
    >
      {/* ── Minimalist Content Container ── */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,209,0.08) 0%, transparent 60%)"
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 select-none flex flex-col items-center w-full max-w-7xl mx-auto px-6 px-10 gap-8 will-change-transform"
      >
        
        {/* Fake 3D "DSO" Text matches the clean stroke-style + solid block shadow */}
        <div className="relative group flex items-center justify-center w-full mt-4">
          <h1 
            className="font-black tracking-tighter"
            style={{
              fontSize: "clamp(120px, 20vw, 320px)",
              lineHeight: "0.8",
              /* Clean transparent fill so the background and stroke pop */
              color: "transparent",
              /* Clean, thin bright teal stroke for high contrast */
              WebkitTextStroke: "2px #00FFD1",
              /* Sharp block extrusion + soft drop shadow */
              textShadow: `
                0 1px 0 rgba(0, 255, 209, 0.1),
                0 2px 0 rgba(0, 255, 209, 0.1),
                0 3px 0 rgba(0, 255, 209, 0.1),
                0 4px 0 rgba(0, 255, 209, 0.05),
                0 5px 0 rgba(0, 255, 209, 0.05),
                0 15px 40px rgba(0, 0, 0, 0.8)
              `,
              /* Subtle requested glow */
              filter: "drop-shadow(0 0 10px rgba(0,255,209,0.2))",
            }}
          >
            DSO
          </h1>
          
          {/* Subtle gradient overlay to simulate surface light */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,209,0.15) 0%, transparent 50%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            DSO
          </div>
        </div>

      </motion.div>
      
      {/* Soft Vignette to blend into section borders cleanly */}
      <div className="absolute inset-0 pointer-events-none border-t border-white/5 opacity-50" />
    </section>
  );
}
