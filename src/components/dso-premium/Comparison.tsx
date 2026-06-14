'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Feature {
 name: string;
 env: boolean;
 docker: boolean;
 dso: boolean;
}

const features: Feature[] = [
 { name: 'Zero Downtime Rotation', env: false, docker: false, dso: true },
 { name: 'Health Validation', env: false, docker: false, dso: true },
 { name: 'Automatic Rollback', env: false, docker: false, dso: true },
 { name: 'Crash Recovery', env: false, docker: false, dso: true },
 { name: 'Multi-Backend Support', env: false, docker: false, dso: true },
 { name: 'Scheduled Rotation', env: false, docker: false, dso: true },
 { name: 'Memory Only', env: true, docker: true, dso: true },
];

const FeatureRow = ({ feature, index }: { feature: Feature; index: number }) => (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.05 }}
 className="py-4 border-b"
 style={{ borderColor: 'rgba(15, 23, 42, 0.1)' }}
 >
 <div className="text-sm" style={{ color: '#6B7280' }}>
 {feature.name}
 </div>
 </motion.div>
);

const ComparisonColumn = ({
 title,
 features,
 isDSO,
 delay,
}: {
 title: string;
 features: Feature[];
 isDSO: boolean;
 delay: number;
}) => (
 <motion.div
 initial={{ opacity: 0, y: 30, scale: 0.95 }}
 whileInView={{ opacity: 1, y: 0, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay, duration: 0.6 }}
 whileHover={isDSO ? { y: -8, scale: 1.02 } : {}}
 className="p-8 rounded-3xl border backdrop-blur-xl"
 style={{
 backgroundColor: isDSO ? 'rgba(4, 120, 87, 0.05)' : 'rgba(248, 250, 252, 0.5)',
 borderColor: isDSO ? 'var(--color-accent)' : '#E5E7EB',
 boxShadow: isDSO ? '0 0 40px rgba(4, 120, 87, 0.15)' : 'none',
 }}
 >
 {/* Header */}
 <h3
 className="text-2xl font-bold mb-2"
 style={{ color: isDSO ? 'var(--color-accent)' : '#1F2937' }}
 >
 {title}
 </h3>
 <p className="text-xs mb-6" style={{ color: '#6B7280' }}>
 {isDSO ? 'Recommended' : 'Limited'}
 </p>

 {/* Features */}
 <div>
 {features.map((feature, idx) => {
 const value =
 title === '.env Files'
 ? feature.env
 : title === 'Docker Secrets'
 ? feature.docker
 : feature.dso;

 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: delay + idx * 0.05 }}
 className="py-4 border-b flex items-center gap-3"
 style={{ borderColor: 'rgba(15, 23, 42, 0.1)' }}
 >
 {value ? (
 <Check size={18} style={{ color: 'var(--color-accent-light)', flexShrink: 0 }} />
 ) : (
 <X
 size={18}
 style={{ color: '#6B7280', opacity: 0.3, flexShrink: 0 }}
 />
 )}
 <span
 className="text-sm flex-1"
 style={{ color: value ? '#1F2937' : '#6B7280' }}
 >
 {feature.name}
 </span>
 </motion.div>
 );
 })}
 </div>
 </motion.div>
);

export const Comparison = () => {
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
 How DSO Compares
 </h2>
 <p className="text-lg max-w-2xl" style={{ color: '#6B7280' }}>
 Infrastructure should handle secret rotation, not engineers.
 </p>
 </motion.div>

 {/* Three floating columns */}
 <div className="grid lg:grid-cols-3 gap-8">
 <ComparisonColumn
 title=".env Files"
 features={features}
 isDSO={false}
 delay={0}
 />
 <ComparisonColumn
 title="Docker Secrets"
 features={features}
 isDSO={false}
 delay={0.1}
 />
 <ComparisonColumn
 title="DSO"
 features={features}
 isDSO={true}
 delay={0.2}
 />
 </div>
 </div>
 </section>
 );
};
