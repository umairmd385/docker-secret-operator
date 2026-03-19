import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Box, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  History,
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', syncs: 45, latency: 120 },
  { time: '11:00', syncs: 52, latency: 115 },
  { time: '12:00', syncs: 48, latency: 125 },
  { time: '13:00', syncs: 61, latency: 110 },
  { time: '14:00', syncs: 55, latency: 118 },
];

const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <div className="bg-dark-card border border-dark-border p-8 rounded-[40px] hover:border-white/10 transition-all group overflow-hidden relative">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-dark border border-dark-border group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <h3 className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1">{title}</h3>
    <p className="text-3xl font-black text-white uppercase tracking-tighter">{value}</p>
  </div>
);

export default function Dashboard() {
  const { activeProvider } = usePlatform();
  const [syncData] = useState(data);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Provider Context Header */}
      <div className="flex justify-between items-center mb-10 overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="bg-brand-cyan/10 border border-brand-cyan/20 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">Active Backend</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter uppercase">{activeProvider?.name || 'Local Store'}</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-600">
          <Clock size={16}/>
          <span className="text-xs font-mono uppercase tracking-widest">Last Global Sync: 12:44:02 UTC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Secrets Injected" value="1,284" change="+12.5%" icon={Key} color="text-brand-cyan" trend="up" />
        <MetricCard title="Injection Rate" value="99.9%" change="+0.2%" icon={Activity} color="text-green-500" trend="up" />
        <MetricCard title="Avg Latency" value="124ms" change="-15ms" icon={Zap} color="text-brand-blue" trend="up" />
        <MetricCard title="Sync Health" value="Stable" change="98%" icon={Shield} color="text-brand-purple" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-dark-border p-10 rounded-[40px] shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Secret Sync Velocity</h3>
              <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Across all registered providers</p>
            </div>
            <TrendingUp size={20} className="text-brand-cyan" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={syncData}>
                <defs>
                  <linearGradient id="colorSyncs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39C7BB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#39C7BB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #30363D', borderRadius: '16px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="syncs" name="Sync ops" stroke="#39C7BB" strokeWidth={3} fillOpacity={1} fill="url(#colorSyncs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border p-10 rounded-[40px] shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Recent Synchronization Events</h3>
              <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Global audit trail</p>
            </div>
            <History size={20} className="text-gray-700" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="w-10 h-10 rounded-2xl bg-dark border border-dark-border flex items-center justify-center text-gray-600 group-hover:text-brand-cyan transition-colors">
                  <Clock size={18} />
                </div>
                <div className="flex-1 pb-6 border-b border-dark-border group-last:border-none">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-white font-bold">Successfully synced {activeProvider?.id?.toUpperCase() || 'LOCAL'} secrets</p>
                    <span className="text-[10px] text-gray-600 font-mono italic">{i * 5}m ago</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">DSO agent verified 12 keys against the authoritative backend.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
