'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Capability {
 category: string;
 items: string[];
}

const capabilities: Capability[] = [
 {
 category: 'Runtime Features',
 items: ['Rolling updates', 'Atomic switching', 'Automatic rollback', 'Health checks', 'Crash recovery', 'Zero downtime'],
 },
 {
 category: 'Provider Support',
 items: ['HashiCorp Vault', 'AWS Secrets Manager', 'Azure Key Vault', 'Huawei Cloud Vault', 'Local Vault', 'Custom providers'],
 },
 {
 category: 'Security Guarantees',
 items: ['Memory-only secrets', 'Zero disk persistence', 'Atomic operations', 'Immediate cleanup', 'IPC isolation', 'Log redaction'],
 },
 {
 category: 'Operational',
 items: ['Docker native', 'Container injection', 'Signal handling', 'Metrics export', 'Webhook support', 'Prometheus compatible'],
 },
];

export const CapabilityGrid = () => {
 const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

 useEffect(() => {
 const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
 setPrefersReducedMotion(mediaQuery.matches);
 const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
 mediaQuery.addEventListener('change', handleChange);
 return () => mediaQuery.removeEventListener('change', handleChange);
 }, []);

 const animationDuration = prefersReducedMotion ? 0 : 0.3;
 const scaleDuration = prefersReducedMotion ? 0 : 0.2;

 return (
 <section className="relative py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-10 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-100 ">
 {/* Background accent */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 <div
 className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
 style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)' }}
 />
 </div>

 <div className="max-w-7xl mx-auto relative z-10">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: animationDuration }}
 className="mb-24 text-center"
 >
 <motion.div
 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
 style={{
 backgroundColor: 'var(--color-accent-dim)',
 borderColor: 'var(--color-border-accent)',
 }}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: scaleDuration }}
 >
 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
 <span className="text-xs font-medium text-emerald-700">Features</span>
 </motion.div>

 <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 ">
 Capability Matrix
 </h2>
 <p className="text-lg text-slate-700 max-w-2xl mx-auto">
 What DSO supports out of the box. Built for production use without compromise.
 </p>
 </motion.div>

 {/* Capability Grid - 2x2 on desktop, responsive on mobile */}
 <motion.div
 className="grid md:grid-cols-2 gap-6 mb-12"
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: animationDuration, staggerChildren: 0.08 }}
 >
 {capabilities.map((category, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ delay: idx * 0.08, duration: animationDuration }}
 className="group relative p-8 rounded-2xl border backdrop-blur-sm transition-all cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
 style={{
 borderColor: 'var(--color-border-default)',
 backgroundColor: 'rgba(248, 250, 252, 0.95)',
 }}
 whileHover={{
 borderColor: 'var(--color-accent)',
 backgroundColor: 'var(--color-accent-dim)',
 y: -2,
 }}
 >
 {/* Category title badge */}
 <motion.div
 className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border"
 style={{
 backgroundColor: 'var(--color-accent-dim)',
 borderColor: 'var(--color-border-accent)',
 }}
 >
 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
 <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
 {category.category}
 </h3>
 </motion.div>

 {/* Items grid */}
 <ul className="space-y-3">
 {category.items.map((item, itemIdx) => (
 <motion.li
 key={itemIdx}
 initial={{ opacity: 0, x: -8 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08 + itemIdx * 0.03, duration: animationDuration }}
 className="flex gap-3 items-start"
 >
 <CheckCircle2
 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
 strokeWidth={1.5}
 />
 <span className="text-slate-700 text-sm">{item}</span>
 </motion.li>
 ))}
 </ul>
 </motion.div>
 ))}
 </motion.div>

 {/* Bottom call-out */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ delay: 0.2, duration: animationDuration }}
 className="p-6 rounded-2xl border backdrop-blur-sm transition-all text-center cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
 style={{
 borderColor: 'var(--color-border-accent)',
 backgroundColor: 'var(--color-accent-dim)',
 }}
 whileHover={{
 borderColor: 'var(--color-border-accent-medium)',
 backgroundColor: 'var(--color-accent-dim-medium)',
 }}
 >
 <p className="text-sm text-slate-700 ">
 <span className="font-bold text-emerald-700">Apache 2.0 Open Source.</span>{' '}
 No enterprise licensing. All features available in the community edition.
 </p>
 </motion.div>
 </div>
 </section>
 );
};
