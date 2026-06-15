"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, Eye, Terminal } from "lucide-react";
import { H2, PLead } from "@/components/ui/Typography";

export const ProductPreview = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Rotation History", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "cli", label: "CLI Output", icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <H2 className="mb-4">Real product. Real visibility.</H2>
          <PLead className="text-gray-400">
            Everything you need to manage rotations. Dashboard and CLI.
          </PLead>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm transition-colors duration-300 flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-500 border-b-2 border-transparent hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-950 rounded-lg border border-gray-800 p-6 mb-8"
          >
            {/* Mock dashboard */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">128</div>
                  <div className="text-sm text-gray-500">Total Rotations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">128</div>
                  <div className="text-sm text-gray-500">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">0</div>
                  <div className="text-sm text-gray-500">Failed</div>
                </div>
              </div>

              {/* Recent rotations table */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Rotations</h3>
                <div className="space-y-3">
                  {[
                    { secret: "database_password", status: "success", time: "2 minutes ago", duration: "2.1s" },
                    { secret: "api_key", status: "success", time: "1 hour ago", duration: "1.8s" },
                    { secret: "slack_token", status: "success", time: "3 hours ago", duration: "2.3s" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-gray-300">{item.secret}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.time}</div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-xs font-mono text-gray-500">{item.duration}</span>
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CLI View */}
        {activeTab === "cli" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-950 rounded-lg border border-gray-800 p-6 font-mono text-sm"
          >
            <div className="space-y-2 text-gray-300">
              <div><span className="text-accent">$</span> dso status</div>
              <div className="text-gray-500">
                Status: running
                <br />
                Provider: aws-secrets-manager
                <br />
                Uptime: 45 days
                <br />
                Last rotation: 2 minutes ago
              </div>
              <div className="mt-4"><span className="text-accent">$</span> dso logs --tail 5</div>
              <div className="text-gray-500 mt-2">
                <div>[INFO] Rotation initiated for: database_password</div>
                <div>[INFO] Health checks: PASSED (2.1s)</div>
                <div>[INFO] Atomic swap: COMPLETED</div>
                <div>[INFO] Cleanup: COMPLETED</div>
                <div className="text-green-400">[INFO] Success: database_password rotated</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          {[
            { icon: <Eye className="w-5 h-5" />, title: "Real-time Monitoring", description: "Track all rotations with detailed history" },
            { icon: <Zap className="w-5 h-5" />, title: "CLI Control", description: "Full control from the command line" },
            { icon: <Terminal className="w-5 h-5" />, title: "Logs & Alerts", description: "Complete audit trail and notifications" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
