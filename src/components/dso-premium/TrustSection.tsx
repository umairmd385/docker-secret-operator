'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Package, Users } from 'lucide-react';

interface TrustItem {
 icon: React.ReactNode;
 label: string;
 value: string;
 detail: string;
}

const trustItems: TrustItem[] = [
 {
 icon: <Package className="w-6 h-6" />,
 label: 'Open Source',
 value: 'Docker Compose',
 detail: 'No licensing, no vendor lock-in. Deploy on your own infrastructure.',
 },
 {
 icon: <Code2 className="w-6 h-6" />,
 label: 'Community Driven',
 value: 'CNCF Sandbox',
 detail: 'Transparent development, public issue tracking, community contributions welcome.',
 },
 {
 icon: <Users className="w-6 h-6" />,
 label: 'Built for Ops',
 value: 'By DevOps Engineers',
 detail: 'Created and maintained by people who run production infrastructure.',
 },
];

export const TrustSection = () => {
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
 <section className="relative py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-10 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 ">
 {/* Background accent */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 <div
 className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
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
 <span className="text-xs font-medium text-emerald-700">Community</span>
 </motion.div>

 <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 ">
 Built for Trust
 </h2>
 <p className="text-lg text-slate-700 max-w-2xl mx-auto">
 Open source infrastructure for teams that need to know exactly what's running in production.
 </p>
 </motion.div>

 {/* Trust Cards Grid */}
 <motion.div
 className="grid md:grid-cols-3 gap-8 mb-20"
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: animationDuration, staggerChildren: 0.08 }}
 >
 {trustItems.map((item, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ delay: idx * 0.08, duration: animationDuration }}
 className="group p-8 rounded-2xl border backdrop-blur-sm transition-all text-center cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
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
 {/* Icon */}
 <motion.div
 className="inline-flex mb-6 p-4 rounded-xl transition-all"
 style={{ backgroundColor: 'var(--color-accent-dim)' }}
 whileHover={{
 scale: 1.08,
 backgroundColor: 'var(--color-accent-dim-medium)',
 }}
 >
 <div className="text-emerald-700">{item.icon}</div>
 </motion.div>

 {/* Label */}
 <p className="text-xs text-emerald-700 mb-2 font-bold uppercase tracking-wider">
 {item.label}
 </p>

 {/* Value */}
 <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.value}</h3>

 {/* Detail */}
 <p className="text-slate-700 text-sm leading-relaxed">{item.detail}</p>
 </motion.div>
 ))}
 </motion.div>

 {/* CTA Section */}
 <div className="relative p-10 lg:p-16 rounded-3xl border text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ delay: 0.1, duration: animationDuration }}
 className="space-y-6 max-w-2xl mx-auto"
 >
 <div>
 <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3">
 Ready to rotate secrets without downtime?
 </h3>
 <p className="text-lg text-slate-700 ">
 Get started with DSO today. Zero-downtime secret rotation for Docker.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <motion.a
 href="https://github.com/docker-secret-operator/dso"
 className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg cursor-pointer focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 hover:shadow-xl"
 style={{
 backgroundColor: 'var(--color-accent)',
 }}
 whileHover={{
 scale: 1.02,
 }}
 whileTap={{ scale: 0.98 }}
 aria-label="Get started with Docker Secret Operator on GitHub"
 >
 Get Started
 </motion.a>
 <motion.a
 href="https://github.com/docker-secret-operator/dso"
 className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
 style={{
 color: 'var(--color-accent)',
 borderColor: 'var(--color-accent)',
 backgroundColor: 'var(--color-accent-dim)',
 }}
 whileHover={{
 backgroundColor: 'var(--color-accent-dim-strong)',
 }}
 whileTap={{ scale: 0.98 }}
 aria-label="View Docker Secret Operator on GitHub"
 >
 View on GitHub
 </motion.a>
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
};
