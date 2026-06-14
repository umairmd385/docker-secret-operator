'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Cloud, Lock, Zap } from 'lucide-react';

interface DeploymentOption {
 icon: React.ReactNode;
 title: string;
 use_case: string;
 features: string[];
 setup: string;
}

const options: DeploymentOption[] = [
 {
 icon: <Container className="w-6 h-6" />,
 title: 'Docker Compose',
 use_case: 'Local development, single host',
 features: ['Instant setup', 'Perfect for dev/test', 'All rotation features'],
 setup: 'dso add service-name',
 },
 {
 icon: <Zap className="w-6 h-6" />,
 title: 'Production Agent',
 use_case: 'Automated rotation at scale',
 features: ['Webhook support', 'Multi-container', 'Crash recovery'],
 setup: 'docker run dso-agent ...',
 },
 {
 icon: <Lock className="w-6 h-6" />,
 title: 'HashiCorp Vault',
 use_case: 'Enterprise secret management',
 features: ['Auth methods', 'Audit logs', 'Policy control'],
 setup: 'provider: vault',
 },
 {
 icon: <Cloud className="w-6 h-6" />,
 title: 'AWS Secrets Manager',
 use_case: 'Cloud-native AWS workloads',
 features: ['IAM auth', 'Automatic rotation', 'Encryption at rest'],
 setup: 'provider: aws',
 },
];

export const DeploymentOptions = () => {
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
 <section className="relative py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-10 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 ">
 {/* Background accent */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 <div
 className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
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
 className="mb-24 text-center w-full"
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
 <span className="text-xs font-medium text-emerald-700">Deployment</span>
 </motion.div>

 <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 ">
 Deployment Paths
 </h2>
 <p className="text-lg text-slate-700 max-w-2xl mx-auto w-full">
 Choose your infrastructure path. Docker Compose for dev, agent for production, or enterprise providers.
 </p>
 </motion.div>

 {/* Grid */}
 <motion.div
 className="grid md:grid-cols-2 gap-8"
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: animationDuration, staggerChildren: 0.08 }}
 >
 {options.map((option, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ delay: idx * 0.08, duration: animationDuration }}
 className="group relative p-7 rounded-2xl border backdrop-blur-sm transition-all cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
 style={{
 borderColor: 'var(--color-border-default)',
 backgroundColor: 'rgba(248, 250, 252, 0.95)',
 }}
 whileHover={{
 borderColor: 'var(--color-accent)',
 backgroundColor: 'var(--color-accent-dim)',
 }}
 >
 {/* Icon */}
 <motion.div
 className="mb-6 p-3 rounded-xl w-fit transition-all"
 style={{ backgroundColor: 'var(--color-accent-dim)' }}
 whileHover={{ backgroundColor: 'var(--color-accent-dim-medium)' }}
 >
 <div className="text-emerald-700">{option.icon}</div>
 </motion.div>

 {/* Title */}
 <h3 className="text-2xl font-bold text-slate-900 mb-2">{option.title}</h3>

 {/* Use case */}
 <p className="text-sm text-slate-700 mb-6 font-medium">
 {option.use_case}
 </p>

 {/* Features */}
 <div className="mb-8 space-y-3">
 {option.features.map((feature, fidx) => (
 <motion.div
 key={fidx}
 className="flex gap-3 text-sm text-slate-700 "
 initial={{ opacity: 0, x: -10 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08 + fidx * 0.04, duration: animationDuration }}
 >
 <span className="text-emerald-600 flex-shrink-0 font-bold">✓</span>
 <span>{feature}</span>
 </motion.div>
 ))}
 </div>

 {/* Divider */}
 <div className="h-px bg-emerald-200/50 mb-6" />

 {/* Setup code */}
 <div>
 <p className="text-xs text-slate-600 mb-3 uppercase tracking-wider font-semibold">
 Quick Setup
 </p>
 <code className="block p-3 rounded-lg bg-slate-50 /50 text-emerald-700 text-xs font-mono overflow-x-auto border border-slate-200 group-hover:border-emerald-300 transition-all">
 {option.setup}
 </code>
 </div>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>
 );
};
