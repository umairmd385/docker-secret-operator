'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight, Cloud } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-accent-dim opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <Container>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-hover border border-border-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs font-medium text-text-secondary">Native Docker Secret Plugin</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-text-primary">
              Native secrets for Docker — <br />
              <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">without Kubernetes.</span>
            </h1>

            <p className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Kubernetes-grade secret security without the complexity. DSO injects cloud secrets directly into your Docker Compose stacks at runtime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Get Started for Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg" className="gap-2">
                <GithubIcon className="w-5 h-5" />
                Star on GitHub
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 py-6 border-t border-border-soft">
              {["Docker Plugin", "Built in Go", "Open Source"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl group">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border-primary">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="text-[10px] font-mono text-text-muted ml-2 opacity-60 uppercase tracking-widest">bash — docker dso up</div>
              </div>
              
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="text-accent select-none">$</span>
                  <span className="text-text-primary">docker dso up -d</span>
                </div>
                <div className="text-text-secondary mt-3 opacity-80">
                  <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-2">✔</span> Stack deployed with zero restarts.
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <span className="text-accent select-none">$</span>
                  <span className="text-text-primary">docker dso fetch prod/db-pass</span>
                </div>
                <div className="text-text-secondary mt-2 opacity-80">
                  <span className="text-accent">✔</span> Value retrieved from AWS SM (AES-256)
                </div>
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none select-none">
                 <Cloud className="w-32 h-32 text-accent" />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
