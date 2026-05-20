"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Automatic Secret Rotation
              <br />
              <span className="text-accent">for Docker</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 font-semibold">
              Zero downtime. Automatic recovery. No Kubernetes required.
            </p>
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
            DSO detects secret changes automatically, spawns a healthy new container, swaps traffic atomically,
            and rolls back on failure—all in 5 seconds. No 3am pages. No operator fatigue.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => {
                  const element = document.getElementById("solution");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors text-lg"
              >
                See the Problem & Solution
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Trust Signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="pt-8 border-t border-gray-800"
          >
            <p className="text-sm sm:text-base text-gray-400">
              Trusted by teams managing <span className="text-accent font-semibold">100k+ secrets</span> in production
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
