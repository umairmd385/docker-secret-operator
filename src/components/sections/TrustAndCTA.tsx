"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { H2 } from "@/components/ui/Typography";

export const TrustAndCTA = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-surface/30 p-12 sm:p-16 text-center"
        >
          <H2 className="mb-4">Ready to automate secret rotation?</H2>
          <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Install DSO and deploy your first automated rotation in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#quick-start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Install DSO
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border-soft hover:border-accent/50 bg-surface/30 hover:bg-surface/50 text-foreground font-semibold rounded-lg transition-all"
            >
              Read Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
