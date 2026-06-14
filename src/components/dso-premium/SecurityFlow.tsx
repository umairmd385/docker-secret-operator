'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, RotateCcw, Eye } from 'lucide-react';

const securityFeatures = [
 {
 icon: Shield,
 title: 'tmpfs Memory',
 description: 'Secrets stored in RAM only. Never touch disk. Ephemeral per container lifecycle.',
 },
 {
 icon: Lock,
 title: 'IPC Boundary',
 description: 'Each container process isolated. Secrets via environment or tmpfs only. No shared memory.',
 },
 {
 icon: RotateCcw,
 title: 'Atomic Rollback',
 description: 'Failed rotation rolls back container instantly. Old secrets still available. Zero data loss.',
 },
 {
 icon: Eye,
 title: 'Log Redaction',
 description: 'Secret values filtered from Docker logs. Operator sees rotation events, not secrets.',
 },
];

export const SecurityFlow = () => {
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

 const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: {
 staggerChildren: 0.08,
 delayChildren: 0.1,
 },
 },
 };

 const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: {
 opacity: 1,
 y: 0,
 transition: { duration: animationDuration },
 },
 };

 return (
 <section className="relative bg-white py-40 px-6 sm:px-8 lg:px-10 border-b border-slate-100 ">
 {/* Background */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 <div
 className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-8"
 style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)' }}
 />
 </div>

 <div className="relative z-10 max-w-7xl mx-auto">
 {/* Section Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: animationDuration }}
 className="mb-24 text-center w-full"
 >
 {/* Badge */}
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
 <span className="text-xs font-medium text-emerald-700">Security</span>
 </motion.div>

 {/* Title */}
 <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 ">
 Built for Infrastructure Security
 </h2>

 {/* Description: max-w-2xl for readable width */}
 <p className="text-lg text-slate-700 max-w-2xl mx-auto w-full">
 Secrets live in memory only. Atomic rotation ensures consistency. Rollback on failure.
 Log redaction protects operator visibility.
 </p>
 </motion.div>

 {/* Architecture Diagram */}
 <motion.div
 variants={containerVariants}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin: '-100px' }}
 className="mb-20"
 >
 {/* SVG Architecture Flow */}
 <motion.div
 variants={itemVariants}
 className="relative rounded-3xl overflow-hidden p-8 lg:p-12 border backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
 style={{
 borderColor: 'var(--color-border-accent)',
 backgroundColor: 'rgba(248, 250, 252, 0.6)',
 }}
 >
 <svg
 className="w-full h-auto"
 viewBox="0 0 1000 400"
 xmlns="http://www.w3.org/2000/svg"
 preserveAspectRatio="xMidYMid meet"
 >
 {/* Gradients */}
 <defs>
 <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="var(--color-accent)" />
 <stop offset="100%" stopColor="var(--color-accent-light)" />
 </linearGradient>
 <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
 <polygon points="0 0, 10 3, 0 6" fill="var(--color-accent)" />
 </marker>
 </defs>

 {/* Step 1: Secret Provider */}
 <g>
 <rect x="20" y="150" width="140" height="100" rx="12" fill="rgba(4, 120, 87, 0.08)" stroke="var(--color-accent)" strokeWidth="2" />
 <text x="90" y="190" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Secret
 </text>
 <text x="90" y="215" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Provider
 </text>
 </g>

 {/* Arrow 1 */}
 <path d="M 160 200 L 220 200" stroke="var(--color-accent)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

 {/* Step 2: DSO Agent */}
 <g>
 <rect x="220" y="150" width="140" height="100" rx="12" fill="rgba(4, 120, 87, 0.12)" stroke="var(--color-accent)" strokeWidth="2" />
 <text x="290" y="190" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 DSO
 </text>
 <text x="290" y="215" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Agent
 </text>
 </g>

 {/* Arrow 2 */}
 <path d="M 360 200 L 420 200" stroke="var(--color-accent)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

 {/* Step 3: tmpfs Volume */}
 <g>
 <rect x="420" y="150" width="140" height="100" rx="12" fill="rgba(4, 120, 87, 0.15)" stroke="var(--color-accent)" strokeWidth="2" />
 <text x="490" y="190" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 tmpfs
 </text>
 <text x="490" y="215" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Volume
 </text>
 </g>

 {/* Arrow 3 */}
 <path d="M 560 200 L 620 200" stroke="var(--color-accent)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

 {/* Step 4: Container */}
 <g>
 <rect x="620" y="150" width="140" height="100" rx="12" fill="rgba(4, 120, 87, 0.18)" stroke="var(--color-accent)" strokeWidth="2" />
 <text x="690" y="190" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Container
 </text>
 <text x="690" y="215" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Process
 </text>
 </g>

 {/* Arrow 4 */}
 <path d="M 760 200 L 820 200" stroke="var(--color-accent)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

 {/* Step 5: Validation */}
 <g>
 <rect x="820" y="150" width="140" height="100" rx="12" fill="rgba(4, 120, 87, 0.08)" stroke="var(--color-accent)" strokeWidth="2" />
 <text x="890" y="190" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Health
 </text>
 <text x="890" y="215" textAnchor="middle" className="text-sm font-semibold" fill="currentColor" dominantBaseline="middle" style={{ fill: 'var(--color-accent)' }}>
 Check
 </text>
 </g>
 </svg>
 </motion.div>
 </motion.div>

 {/* Security Features Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {securityFeatures.map((feature, idx) => {
 const Icon = feature.icon;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ delay: idx * 0.08, duration: animationDuration }}
 className="p-6 rounded-2xl border backdrop-blur-sm transition-all hover:shadow-lg cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
 style={{
 borderColor: 'var(--color-border-accent)',
 backgroundColor: 'rgba(248, 250, 252, 0.5)',
 }}
 whileHover={{
 borderColor: 'var(--color-accent)',
 backgroundColor: 'var(--color-accent-dim)',
 }}
 >
 <motion.div
 className="flex items-start gap-4"
 initial={{ opacity: 0, x: -10 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08 + 0.03, duration: animationDuration }}
 >
 {/* Icon */}
 <div
 className="flex-shrink-0 p-3 rounded-lg"
 style={{ backgroundColor: 'var(--color-accent-dim)' }}
 >
 <Icon
 className="w-6 h-6"
 style={{ color: 'var(--color-accent)' }}
 strokeWidth={1.5}
 />
 </div>

 {/* Content */}
 <div className="flex-1 min-w-0">
 <h3 className="text-base font-semibold text-slate-900 mb-2">
 {feature.title}
 </h3>
 <p className="text-sm text-slate-700 leading-relaxed">
 {feature.description}
 </p>
 </div>
 </motion.div>
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>
 );
};
