'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Zap, Trash2, RotateCw, Database, Puzzle, Shield } from 'lucide-react';

interface BentoCardProps {
 icon: React.ReactNode;
 title: string;
 description: string;
 span?: string;
 delay: number;
}

const BentoCard = ({ icon, title, description, span = 'lg:col-span-1 lg:row-span-1', delay }: BentoCardProps) => (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 whileInView={{ opacity: 1, y: 0, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay, duration: 0.5 }}
 whileHover={{ y: -8, scale: 1.02 }}
 className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 group cursor-pointer ${span}`}
 style={{
 backgroundColor: 'rgba(248, 250, 252, 0.5)',
 borderColor: '#E5E7EB',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.borderColor = 'var(--color-accent)';
 e.currentTarget.style.boxShadow = '0 0 40px rgba(4, 120, 87, 0.2)';
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.borderColor = '#E5E7EB';
 e.currentTarget.style.boxShadow = 'none';
 }}
 >
 <motion.div
 className="mb-6 p-3 rounded-xl w-fit"
 style={{ backgroundColor: 'rgba(4, 120, 87, 0.08)' }}
 whileHover={{ scale: 1.15, rotate: 5 }}
 >
 <div style={{ color: 'var(--color-accent)' }}>{icon}</div>
 </motion.div>

 <h3 className="text-xl font-bold mb-3" style={{ color: '#1F2937' }}>
 {title}
 </h3>

 <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
 {description}
 </p>
 </motion.div>
);

export const BentoCanvas = () => {
 const cards = [
 {
 icon: <HardDrive size={32} />,
 title: 'Zero Disk Persistence',
 description: 'Secrets streamed directly into memory. Never written to disk. Complete ephemeral lifecycle.',
 span: 'lg:col-span-2 lg:row-span-2',
 delay: 0,
 },
 {
 icon: <Zap size={24} />,
 title: 'Atomic Injection',
 description: 'TAR streamed to tmpfs. All-or-nothing semantics.',
 span: 'lg:col-span-1 lg:row-span-1',
 delay: 0.1,
 },
 {
 icon: <Trash2 size={24} />,
 title: 'Instant Cleanup',
 description: 'Old container and secrets removed immediately.',
 span: 'lg:col-span-1 lg:row-span-1',
 delay: 0.2,
 },
 {
 icon: <RotateCw size={24} />,
 title: 'Crash Recovery',
 description: 'Scheduler restores from clean state on restart.',
 span: 'lg:col-span-1 lg:row-span-1',
 delay: 0.3,
 },
 {
 icon: <Database size={24} />,
 title: 'Multiple Backends',
 description: 'Vault, AWS, Azure, GCP. Extensible provider interface.',
 span: 'lg:col-span-1 lg:row-span-1',
 delay: 0.4,
 },
 {
 icon: <Puzzle size={24} />,
 title: 'Plugin Framework',
 description: 'Build DSO extensions in Go or Rust.',
 span: 'lg:col-span-2 lg:row-span-1',
 delay: 0.5,
 },
 {
 icon: <Shield size={24} />,
 title: 'Disaster Recovery',
 description: 'Snapshot and restore support. Time-travel recovery.',
 span: 'lg:col-span-1 lg:row-span-1',
 delay: 0.6,
 },
 ];

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
 Production-Grade Guarantees
 </h2>
 <p className="text-lg max-w-2xl" style={{ color: '#6B7280' }}>
 Zero-downtime secret rotation backed by hardened infrastructure patterns.
 </p>
 </motion.div>

 {/* Bento grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
 {cards.map((card, idx) => (
 <BentoCard key={idx} {...card} />
 ))}
 </div>
 </div>
 </section>
 );
};
