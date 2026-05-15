"use client";

import React, { useState } from "react"; import { motion } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Card } from "@/components/ui/Card";

type OS = "linux" | "windows";
type Mode = "local" | "cloud";

const osScripts = {
  linux: `curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash`,
  windows: `irm https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.ps1 | iex`
};

export const QuickStartTabs = () => {
  const [activeOS, setActiveOS] = useState<OS>("linux");
  const [activeMode, setActiveMode] = useState<Mode>("local");

  return (
    <section id="quick-start" className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-background via-blue-500/2 to-background border-t border-b border-blue-500/15 overflow-hidden">
      {/* Blue telemetry atmosphere for quick start context */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-l from-blue-500/5 via-transparent to-transparent rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Get Started in Under 2 Minutes
          </h2>
          <p className="text-xs sm:text-sm font-mono text-accent/70 tracking-wide mb-6">
            ◆ QUICK START ◆
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={() => setActiveMode("local")}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-full border text-sm transition-all ${activeMode === "local" ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" : "border-border text-gray-400 hover:border-gray-500"}`}
            >
              Local Mode (Native Vault)
            </button>
            <button
              onClick={() => setActiveMode("cloud")}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-full border text-sm transition-all ${activeMode === "cloud" ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" : "border-border text-gray-400 hover:border-gray-500"}`}
            >
              Cloud Mode (AWS/Azure/Vault)
            </button>
          </div>
        </motion.div>

        <div className="space-y-10 sm:space-y-14">
          {/* Step 1: Install */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold shrink-0 shadow-sm mt-1 text-lg">
              1
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Install DSO CLI Plugin</h3>
              <p className="text-gray-400 text-sm mb-4">Download the latest binary and install it as a Docker CLI plugin.</p>
              <Card className="p-1">
                <div className="flex gap-2 p-2 border-b border-border/50">
                  <button
                    onClick={() => setActiveOS("linux")}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors ${activeOS === "linux" ? "bg-accent/20 text-accent" : "text-gray-400 hover:text-white"}`}
                  >
                    Linux / macOS
                  </button>
                  <button
                    onClick={() => setActiveOS("windows")}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors ${activeOS === "windows" ? "bg-accent/20 text-accent" : "text-gray-400 hover:text-white"}`}
                  >
                    Windows
                  </button>
                </div>
                <div className="p-2">
                  <CodeSnippet language={activeOS === "linux" ? "bash" : "powershell"} code={osScripts[activeOS]} />
                </div>
              </Card>
            </div>
          </div>

          {/* Step 2: Initialize */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-gray-300 font-bold shrink-0 mt-1 text-lg">
              2
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {activeMode === "local" ? "Initialize & Set Secrets" : "Setup Cloud Providers"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {activeMode === "local"
                  ? "Initialize your local encrypted vault and set your first secret."
                  : "Install verified plugins for your cloud providers with integrity checks."}
              </p>
              <CodeSnippet
                language="bash"
                code={activeMode === "local" ? "docker dso init\ndocker dso secret set DB_PASSWORD mysecret" : "docker dso system setup --providers aws"}
              />
            </div>
          </div>

          {/* Step 3: Deploy */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-gray-300 font-bold shrink-0 mt-1 text-lg">
              3
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Deploy and Inject</h3>
              <p className="text-gray-400 text-sm mb-4">
                {activeMode === "local"
                  ? "DSO automatically detects your local vault and injects secrets into your stack."
                  : "Sync secrets from your cloud provider directly into target containers."}
              </p>
              <CodeSnippet
                language="bash"
                code={activeMode === "local" ? "docker dso up -d" : "docker dso up -c dso.yaml -d"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
