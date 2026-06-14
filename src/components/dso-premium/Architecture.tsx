'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Package, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

const stages = [
 { label: 'Secret\nBackend', icon: Database },
 { label: 'DSO\nScheduler', icon: Cpu },
 { label: 'New\nContainer', icon: Package },
 { label: 'Health\nValidation', icon: CheckCircle },
 { label: 'Atomic\nSwitch', icon: RefreshCw },
 { label: 'Cleanup', icon: Trash2 },
];

const Particle = ({ delay, index }: { delay: number; index: number }) => (
 <motion.div
 className="absolute w-1.5 h-1.5 rounded-full"
 style={{
 backgroundColor: '#06B6D4',
 left: '0%',
 top: `${50 + Math.sin(index * 0.5) * 15}%`,
 }}
 animate={{
 left: '100%',
 opacity: [0, 1, 0],
 }}
 transition={{
 duration: 4,
 delay,
 repeat: Infinity,
 }}
 />
);

export const Architecture = () => {
 const particles = Array.from({ length: 8 });

 return (
 <section className="py-40" style={{ backgroundColor: '#FFFFFF' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mb-20 space-y-4"
 >
 <h2 className="text-6xl font-black leading-tight" style={{ color: '#1F2937' }}>
 How It Works
 </h2>
 <p className="text-lg max-w-2xl" style={{ color: '#6B7280' }}>
 From secret detection to zero-downtime rotation in milliseconds.
 </p>
 </motion.div>

 {/* Pipeline */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="hidden lg:block relative h-48 rounded-3xl border backdrop-blur-xl overflow-hidden"
 style={{
 backgroundColor: 'rgba(19, 21, 26, 0.4)',
 borderColor: '#E5E7EB',
 }}
 >
 {/* Particle flow container */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 {particles.map((_, i) => (
 <Particle key={i} delay={i * 0.5} index={i} />
 ))}
 </div>

 {/* Pipeline stages */}
 <div className="h-full flex items-center justify-between px-8">
 {stages.map((stage, idx) => {
 const Icon = stage.icon;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="flex flex-col items-center gap-3 relative z-10"
 >
 {/* Icon */}
 <motion.div
 className="p-4 rounded-2xl"
 style={{
 backgroundColor: 'rgba(4, 120, 87, 0.08)',
 border: '1px solid rgba(6, 182, 212, 0.3)',
 }}
 whileHover={{ scale: 1.1 }}
 >
 <Icon size={28} style={{ color: '#06B6D4' }} />
 </motion.div>

 {/* Label */}
 <p
 className="text-xs text-center font-medium whitespace-pre-line"
 style={{ color: '#1F2937' }}
 >
 {stage.label}
 </p>

 {/* Arrow */}
 {idx < stages.length - 1 && (
 <motion.div
 className="absolute -right-4 top-6 text-2xl"
 animate={{ x: [0, 4, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 style={{ color: '#06B6D4' }}
 >
 →
 </motion.div>
 )}
 </motion.div>
 );
 })}
 </div>
 </motion.div>

 {/* Mobile: Vertical flow */}
 <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 className="lg:hidden space-y-4"
 >
 {stages.map((stage, idx) => {
 const Icon = stage.icon;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="flex items-center gap-4 p-4 rounded-2xl"
 style={{
 backgroundColor: 'rgba(248, 250, 252, 0.5)',
 borderColor: '#E5E7EB',
 border: '1px solid rgba(34, 38, 48, 0.5)',
 }}
 >
 <div
 className="p-3 rounded-xl flex-shrink-0"
 style={{ backgroundColor: 'rgba(4, 120, 87, 0.08)' }}
 >
 <Icon size={24} style={{ color: '#06B6D4' }} />
 </div>
 <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>
 {stage.label}
 </span>
 </motion.div>
 );
 })}
 </motion.div>

 {/* Success summary */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mt-16 p-8 rounded-3xl border"
 style={{
 backgroundColor: 'rgba(6, 182, 212, 0.05)',
 borderColor: '#06B6D4',
 boxShadow: '0 0 40px rgba(6, 182, 212, 0.1)',
 }}
 >
 <div className="text-center space-y-2">
 <p className="text-lg font-bold" style={{ color: '#06B6D4' }}>
 ✓ Zero Downtime Achieved
 </p>
 <p className="text-sm" style={{ color: '#6B7280' }}>
 Automatic rollback on any failure. Complete audit trail of all rotations.
 </p>
 </div>
 </motion.div>
 </div>
 </section>
 );
};
