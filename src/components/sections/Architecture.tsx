"use client";

import React from "react";
import { motion } from "framer-motion";
import { HardDrive, Server, Shield, Cpu, ChevronRight } from "lucide-react";

const FlowItem = ({ icon: Icon, label, sublabel }: { icon: any, label: string, sublabel?: string }) => (
  <div className="flex-shrink-0 flex flex-col items-center gap-2 w-20 sm:w-24">
    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div className="text-center w-full">
      <div className="text-xs font-bold text-foreground leading-tight whitespace-nowrap">{label}</div>
      {sublabel && <div className="text-[9px] font-mono text-gray-500 uppercase mt-0.5 leading-tight">{sublabel}</div>}
    </div>
  </div>
);

const Arrow = () => (
  <div className="flex-shrink-0 lg:flex-1 flex items-center justify-center py-2 lg:py-0 text-gray-700">
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
    <section id="architecture" className="py-12 sm:py-20 lg:py-24 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4 font-outfit">
            Dual-Mode Execution
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Start local. Scale to cloud. Use the same CLI workflow in every environment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Local Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-surface/20 border border-border/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 sm:p-4 text-[9px] sm:text-[10px] font-mono text-accent uppercase tracking-widest opacity-50">Local</div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-8 flex items-center gap-2">
              <HardDrive className="w-4 sm:w-5 h-4 sm:h-5 text-accent shrink-0" />
              Development
            </h3>

            <div className="flex flex-col lg:flex-row items-center gap-0">
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
            className="p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-surface/20 border border-border/40 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-2 sm:p-4 text-[9px] sm:text-[10px] font-mono text-blue-400 uppercase tracking-widest opacity-50">Cloud Mode</div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-8 flex items-center gap-2">
              <Server className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 shrink-0" />
              Production
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center gap-0">
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
