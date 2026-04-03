'use client';

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Phone } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function CTASection() {
  return (
    <section id="for-teams" className="py-24 bg-bg-primary">
      <Container>
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative rounded-3xl border border-accent/20 bg-surface overflow-hidden shadow-2xl p-12 md:p-20 text-center"
        >
          {/* Background Glow */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-accent-dim opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-xs font-bold tracking-widest uppercase text-accent mb-4">Ready to get started?</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Secure your team&apos;s secrets today.
            </h2>
            <p className="text-text-secondary text-lg mb-10 leading-relaxed">
              Book a 30-minute call to discuss your team&apos;s setup, or jump straight in with the open-source version.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-2"
                  onClick={() => window.open('https://calendar.zoho.in/eventreqForm/zz080212306015c0e0b6dda39a0dbbe6e502684f80748e3be0b02b2b9d859aadee90aacd079adc2495a22fb25775cd52a8662fb89a?theme=0&l=en&tz=Asia/Kolkata', '_blank')}
               >
                  <Phone className="w-4 h-4" />
                  Book a Call
               </Button>
               <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto gap-2"
                  onClick={() => window.open('https://github.com/umairmd385/docker-secret-operator', '_blank')}
               >
                  <GithubIcon className="w-5 h-5" />
                  View on GitHub
               </Button>
            </div>
            
            <div className="mt-8 text-xs text-text-muted font-mono tracking-tight">
               MIT Licensed • Open Source • Built for Production
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
