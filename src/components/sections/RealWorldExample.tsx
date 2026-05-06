"use client";

import React from "react";
import { motion } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

export const RealWorldExample = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 border-t border-border bg-[#05080f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <Badge className="mb-3 sm:mb-4">Implementation</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
            How it looks in practice
          </h2>
          <p className="text-accent text-sm sm:text-base lg:text-lg font-medium max-w-2xl mx-auto mb-1.5 sm:mb-2">
            Your application never sees the secret until runtime.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-2 sm:px-4 lg:px-0">
            Decouple your credentials completely from your git repository. Notice how the `docker-compose.yml` has zero knowledge of the actual secrets.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start relative">
          {/* Decorative link between the two blocks */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-surface border border-accent/30 rounded-full items-center justify-center shadow-[0_0_20px_rgba(0,230,192,0.2)]">
            <ArrowRight className="w-5 h-5 text-accent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-200">1. Standard Compose File</h3>
              <Badge variant="ghost" className="w-fit">docker-compose.yml</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Deploy your apps using native docker-compose syntax. Secrets are referenced, but the explicit values are intentionally omitted.</p>
            <CodeSnippet 
              language="yaml" 
              fileName="docker-compose.yml"
              code={"services:\n  api:\n    image: mycorp/api:latest\n    labels:\n      dso.reloader: \"true\"\n      dso.strategy: \"rolling\"\n    secrets:\n      - PROD_DB_PASS\n\nsecrets:\n  PROD_DB_PASS:\n    external: true"}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <h3 className="text-base sm:text-lg font-bold text-accent">2. DSO Mapping configuration</h3>
              <Badge variant="success" className="w-fit">dso.yaml</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">DSO intercepts the container startup and maps the cloud backend specifically to the tmpfs file boundary.</p>
            <CodeSnippet 
              language="yaml" 
              fileName="dso.yaml"
              code={"provider: aws\nconfig:\n  region: us-east-1\n\nsecrets:\n  - name: production/db-pass\n    inject: env\n    rotation: true\n    reload_strategy:\n      type: signal\n      signal: SIGHUP\n    mappings:\n      password: PROD_DB_PASS"}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
