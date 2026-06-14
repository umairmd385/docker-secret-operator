'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface Step {
 id: string;
 number: number;
 label: string;
 command: string;
}

const steps: Step[] = [
 { id: '1', number: 1, label: 'Install', command: 'curl -fsSL https://get.dso.dev | sh' },
 { id: '2', number: 2, label: 'Initialize', command: 'dso init' },
 { id: '3', number: 3, label: 'Start', command: 'docker compose up -d' },
];

const ProgressStep = ({ number, isActive }: { number: number; isActive: boolean }) => (
 <motion.div
 className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
 style={{
 backgroundColor: isActive ? '#06B6D4' : 'rgba(6, 182, 212, 0.1)',
 color: isActive ? '#FFFFFF' : '#06B6D4',
 boxShadow: isActive ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
 }}
 animate={{ scale: isActive ? 1.15 : 1 }}
 >
 {number}
 </motion.div>
);

export const CLIPanel = () => {
 const [activeStep, setActiveStep] = useState(0);
 const [copied, setCopied] = useState(false);

 const handleCopy = () => {
 navigator.clipboard.writeText(steps[activeStep].command);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <section className="py-40" style={{ backgroundColor: '#FFFFFF' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mb-16 space-y-4"
 >
 <h2 className="text-6xl font-black leading-tight" style={{ color: '#1F2937' }}>
 Get Started in 3 Steps
 </h2>
 <p className="text-lg max-w-2xl" style={{ color: '#6B7280' }}>
 Zero-downtime secret rotation starts now.
 </p>
 </motion.div>

 {/* Split layout: Left steps, Right code */}
 <div className="grid lg:grid-cols-2 gap-12">
 {/* LEFT: Progress indicators */}
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="space-y-12"
 >
 {steps.map((step, idx) => (
 <motion.div
 key={step.id}
 onClick={() => setActiveStep(idx)}
 className="flex items-start gap-6 cursor-pointer"
 whileHover={{ x: 8 }}
 >
 {/* Step indicator */}
 <ProgressStep number={step.number} isActive={idx === activeStep} />

 {/* Step label */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: idx * 0.1 }}
 className="flex-1 pt-2"
 >
 <h3
 className="text-xl font-bold mb-2"
 style={{ color: idx === activeStep ? '#1F2937' : '#6B7280' }}
 >
 {step.label}
 </h3>
 <p
 className="text-sm"
 style={{ color: '#6B7280' }}
 >
 {step.id === '1' && 'Download and install DSO'}
 {step.id === '2' && 'Initialize configuration'}
 {step.id === '3' && 'Start your application'}
 </p>
 </motion.div>

 {/* Divider line */}
 {idx < steps.length - 1 && (
 <div
 className="absolute left-5 w-px h-12 -bottom-12"
 style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
 />
 )}
 </motion.div>
 ))}
 </motion.div>

 {/* RIGHT: Terminal card */}
 <motion.div
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="rounded-3xl border backdrop-blur-xl overflow-hidden"
 style={{
 backgroundColor: 'rgba(248, 250, 252, 0.5)',
 borderColor: '#E5E7EB',
 }}
 >
 {/* Terminal header */}
 <div
 className="flex items-center gap-2 px-6 py-4 border-b"
 style={{ borderColor: '#E5E7EB', backgroundColor: 'rgba(6, 182, 212, 0.05)' }}
 >
 <div className="flex gap-1.5">
 <div className="w-3 h-3 rounded-full bg-red-500/70" />
 <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
 <div className="w-3 h-3 rounded-full bg-green-500/70" />
 </div>
 <span className="text-xs ml-auto" style={{ color: '#6B7280' }}>
 dso-setup.sh
 </span>
 </div>

 {/* Terminal content */}
 <div className="p-8 font-mono">
 <AnimatePresence mode="wait">
 <motion.div
 key={activeStep}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 className="space-y-4"
 >
 {/* Command */}
 <div className="text-sm">
 <span style={{ color: '#06B6D4' }}>$</span>{' '}
 <span style={{ color: '#1F2937' }}>
 {steps[activeStep].command}
 </span>
 </div>

 {/* Simulated output */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.2 }}
 className="text-xs space-y-1"
 style={{ color: 'var(--color-accent-light)' }}
 >
 <div>✓ Downloaded successfully</div>
 <div>✓ Installation complete</div>
 </motion.div>
 </motion.div>
 </AnimatePresence>

 {/* Copy button */}
 <motion.button
 onClick={handleCopy}
 className="mt-6 px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center gap-2"
 style={{
 backgroundColor: 'rgba(4, 120, 87, 0.08)',
 color: '#06B6D4',
 border: '1px solid rgba(6, 182, 212, 0.3)',
 }}
 whileHover={{
 backgroundColor: 'rgba(6, 182, 212, 0.2)',
 }}
 >
 {copied ? (
 <>
 <Check size={16} />
 Copied!
 </>
 ) : (
 <>
 <Copy size={16} />
 Copy command
 </>
 )}
 </motion.button>
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
};
