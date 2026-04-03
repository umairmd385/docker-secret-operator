'use client';

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Server, Shield, Database, ArrowRight } from "lucide-react";

export function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-surface/30 border-b border-border-soft overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-4"
          >
            Native Architecture.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            DSO runs as a lightweight systemd service. No overhead. No complexity.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-16 items-center">
          <div className="grid grid-cols-1 gap-4">
             <div className="flex flex-col items-center gap-2 group">
                <div className="w-full max-w-md p-8 bg-bg-primary border border-orange-500/20 rounded-3xl text-center relative group-hover:border-orange-500/40 transition-colors">
                   <div className="text-orange-500 font-bold uppercase tracking-widest text-[10px] mb-2 opacity-60">Source</div>
                   <p className="text-orange-500 font-bold text-xl">Cloud Secret Manager</p>
                   <p className="text-xs text-text-muted mt-2">AWS · Azure · Vault · Huawei</p>
                </div>
                
                <div className="h-12 w-px bg-gradient-to-b from-orange-500/20 to-accent/20"></div>
                
                <div className="w-full max-w-md p-10 bg-accent/5 border border-accent/30 rounded-[2.5rem] text-center relative group-hover:bg-accent/10 transition-all">
                   <div className="text-accent font-bold uppercase tracking-widest text-[10px] mb-2 opacity-60">Engine</div>
                   <p className="text-accent font-bold text-2xl">DSO Agent</p>
                   <p className="text-xs text-text-muted mt-2 uppercase tracking-tighter">Polls · Caches · Injects</p>
                </div>
                
                <div className="h-12 w-px bg-gradient-to-b from-accent/20 to-blue-500/20"></div>
                
                <div className="w-full max-w-md p-8 bg-bg-primary border border-blue-500/20 rounded-3xl text-center relative group-hover:border-blue-500/40 transition-colors">
                   <div className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mb-2 opacity-60">Destination</div>
                   <p className="text-blue-500 font-bold text-xl">Runtime Container</p>
                   <p className="text-xs text-text-muted mt-2">ENV VAR / MOUNT</p>
                </div>
             </div>
          </div>

          <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex gap-6 p-6 rounded-3xl hover:bg-surface border border-transparent hover:border-border-primary transition-all group"
            >
               <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">1</div>
               <div>
                 <h4 className="text-lg font-bold text-text-primary mb-2">Native System Service</h4>
                 <p className="text-text-secondary leading-relaxed text-sm">Runs as a lightweight systemd service. Minimal CPU and memory footprint compared to sidecar models.</p>
               </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="flex gap-6 p-6 rounded-3xl hover:bg-surface border border-transparent hover:border-border-primary transition-all group"
            >
               <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">2</div>
               <div>
                 <h4 className="text-lg font-bold text-text-primary mb-2">Secure Isolation</h4>
                 <p className="text-text-secondary leading-relaxed text-sm">Provider logic is isolated in separate binaries. A crash in one provider won&apos;t affect the main agent.</p>
               </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="flex gap-6 p-6 rounded-3xl hover:bg-surface border border-transparent hover:border-border-primary transition-all group"
            >
               <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">3</div>
               <div>
                 <h4 className="text-lg font-bold text-text-primary mb-2">Unix Socket Influx</h4>
                 <p className="text-text-secondary leading-relaxed text-sm">Agent communicates with Docker over a secure local Unix socket. Zero network persistence by design.</p>
               </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
