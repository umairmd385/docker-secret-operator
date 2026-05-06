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
    <section id="quick-start" className="py-12 sm:py-20 bg-surface2/30 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            Get Started in Under 2 Minutes
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={() => setActiveMode("local")}
              className={`px-3 sm:px-6 py-2 rounded-full border transition-all text-xs sm:text-sm whitespace-nowrap ${activeMode === "local" ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" : "border-border text-gray-400 hover:border-gray-500"}`}
            >
              <span className="hidden sm:inline">Local Mode (Native Vault)</span>
              <span className="sm:hidden">Local</span>
            </button>
            <button
              onClick={() => setActiveMode("cloud")}
              className={`px-3 sm:px-6 py-2 rounded-full border transition-all text-xs sm:text-sm whitespace-nowrap ${activeMode === "cloud" ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" : "border-border text-gray-400 hover:border-gray-500"}`}
            >
              <span className="hidden sm:inline">Cloud Mode (AWS/Azure/Vault)</span>
              <span className="sm:hidden">Cloud</span>
            </button>
          </div>
        </motion.div>

        <div className="space-y-8 sm:space-y-12">
          {/* Step 1: Install */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start">
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
          <div className="flex flex-col md:flex-row gap-8 items-start">
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
          <div className="flex flex-col md:flex-row gap-8 items-start">
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
