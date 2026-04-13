"use client";

import React, { useState } from "react";import { motion } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Card } from "@/components/ui/Card";

type OS = "linux" | "windows";

const osScripts = {
  linux: `curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash`,
  windows: `irm https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.ps1 | iex`
};

export const QuickStartTabs = () => {
  const [activeOS, setActiveOS] = useState<OS>("linux");

  return (
    <section id="quick-start" className="py-24 bg-surface2/30 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Get Started in Under 2 Minutes
          </h2>
          <p className="text-sm font-mono text-accent/70 tracking-wide mb-3">
            Go from zero to secure in under 2 minutes.
          </p>
          <p className="text-gray-400">
            From zero to syncing secrets safely in production.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold shrink-0 opacity-80 shadow-sm mt-1">
              1
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Install DSO Plugin</h3>
              <p className="text-gray-400 text-sm mb-4">Run the installation script to place the CLI plugin in your Docker directory.</p>
              <Card className="p-1">
                <div className="flex gap-2 p-2 border-b border-border/50">
                  <button 
                    onClick={() => setActiveOS("linux")}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors ${activeOS === "linux" ? "bg-accent/20 text-accent" : "text-gray-400 hover:text-white"}`}
                  >
                    Linux / Local macOS
                  </button>
                  <button 
                    onClick={() => setActiveOS("windows")}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors ${activeOS === "windows" ? "bg-accent/20 text-accent" : "text-gray-400 hover:text-white"}`}
                  >
                    Windows PowerShell
                  </button>
                </div>
                <div className="p-2">
                  <CodeSnippet language={activeOS === "linux" ? "bash" : "powershell"} code={osScripts[activeOS]} />
                </div>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-gray-300 font-bold shrink-0 mt-1">
              2
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Map Your Providers</h3>
              <p className="text-gray-400 text-sm mb-4">Create a <code className="text-accent bg-accent/10 px-1 py-0.5 rounded">dso.yaml</code> mapping your backend secret stores to your environment.</p>
              <CodeSnippet 
                language="yaml" 
                fileName="dso.yaml"
                code={"provider: aws\nconfig:\n  region: us-east-1\n\nsecrets:\n  - name: production/db-pass\n    inject: env\n    rotation: true\n    mappings:\n      password: DB_PASSWORD"} 
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-gray-300 font-bold shrink-0 mt-1">
              3
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Deploy the Stack</h3>
              <p className="text-gray-400 text-sm mb-4">The DSO agent starts automatically and injects secrets in real time.</p>
              <CodeSnippet language="bash" code="docker dso up -c dso.yaml -f docker-compose.yml -d" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
