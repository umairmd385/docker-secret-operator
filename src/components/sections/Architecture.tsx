"use client";

import React from "react";
import { motion } from "framer-motion";
import { HardDrive, Server, Shield, Cpu, ChevronRight } from "lucide-react";

const FlowItem = ({ icon: Icon, label, sublabel }: { icon: any, label: string, sublabel?: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <div className="text-center">
      <div className="text-sm font-bold text-foreground">{label}</div>
      {sublabel && <div className="text-[10px] font-mono text-gray-500 uppercase">{sublabel}</div>}
    </div>
  </div>
);

const Arrow = () => (
  <div className="flex items-center justify-center py-4 lg:py-0 lg:px-4 text-gray-700">
    <ChevronRight className="w-5 h-5 hidden lg:block" />
    <motion.div 
      animate={{ y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="block lg:hidden"
    >
      <ChevronRight className="w-5 h-5 rotate-90" />
    </motion.div>
  </div>
);

export const Architecture = () => {
  return (
    <section id="architecture" className="py-20 md:py-24 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 font-outfit">
            Dual-Mode Execution
          </h2>
          <p className="text-gray-400 text-lg">
            Start local. Scale to cloud. Use the same CLI workflow in every environment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
          {/* Local Mode */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-surface/20 border border-border/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-accent uppercase tracking-widest opacity-50">Local Mode</div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-accent" />
              Development
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <FlowItem icon={Cpu} label="DSO CLI" sublabel="docker dso" />
              <Arrow />
              <FlowItem icon={Shield} label="Local Vault" sublabel="~/.dso/vault.enc" />
              <Arrow />
              <FlowItem icon={Server} label="Injection" sublabel="In-Memory RAMfs" />
            </div>
            <p className="mt-8 text-sm text-gray-500 leading-relaxed italic">
              No cloud dependency. No root required. Perfect for isolated dev environments.
            </p>
          </motion.div>

          {/* Cloud Mode */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-surface/20 border border-border/40 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-blue-400 uppercase tracking-widest opacity-50">Cloud Mode</div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Production
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <FlowItem icon={Cpu} label="DSO CLI" sublabel="docker dso" />
              <Arrow />
              <FlowItem icon={Server} label="System Agent" sublabel="systemd daemon" />
              <Arrow />
              <FlowItem icon={Shield} label="Providers" sublabel="AWS/Azure/Vault" />
              <Arrow />
              <FlowItem icon={Server} label="Injection" sublabel="Production Stack" />
            </div>
            <p className="mt-8 text-sm text-gray-500 leading-relaxed italic">
              Enterprise-grade rotation. Managed identity support. Multi-cloud plugins.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
