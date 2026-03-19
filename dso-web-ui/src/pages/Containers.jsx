import React, { useState, useEffect } from 'react';
import { Box, CheckCircle, RefreshCw, Terminal, Cpu, Key, ExternalLink, Activity, Info } from 'lucide-react';
import { dsoApi } from '../services/api';
import { usePlatform } from '../context/PlatformContext';

export default function Containers() {
  const { activeProvider } = usePlatform();
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContainer, setActiveContainer] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await dsoApi.getContainers();
      setContainers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center bg-dark-card border border-dark-border p-8 rounded-[40px]">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 uppercase tracking-tighter">Workload Inventory</h1>
          <p className="text-gray-500">Live map of secret injection status across all container workloads.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-dark border border-dark-border px-8 py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-white transition-all flex items-center gap-3">
            <RefreshCw size={18} className="animate-spin-slow" />
            Scan Fleet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Container Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-dark-card border border-dark-border h-64 rounded-3xl animate-pulse"></div>
            ))
          ) : containers.map((c) => (
            <div 
              key={c.name} 
              onClick={() => setActiveContainer(c)}
              className={`bg-dark-card border rounded-[40px] p-8 cursor-pointer transition-all group relative overflow-hidden
                ${activeContainer?.name === c.name ? 'border-brand-blue/50 ring-1 ring-brand-blue/20' : 'border-dark-border hover:border-white/10'}
              `}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-dark border border-dark-border flex items-center justify-center text-gray-600 transition-colors
                  ${activeContainer?.name === c.name ? 'text-brand-blue border-brand-blue/30' : 'group-hover:text-brand-blue'}
                `}>
                  <Box size={28} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    <CheckCircle size={10} />
                    {c.status}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{c.name}</h3>
              <div className="flex items-center gap-4 pt-6 border-t border-dark-border/50 mt-4">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-1">Secrets</p>
                  <p className="text-sm text-white font-bold">{c.secrets.length} Active</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-1">Last Sync</p>
                  <p className="text-sm text-brand-cyan font-bold">{c.last_injection}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workload Deep Dive */}
        <div className="bg-dark-card border border-dark-border rounded-[40px] p-8 lg:sticky lg:top-8 h-fit">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-dark-border">
            <Activity size={20} className="text-brand-blue" />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Workload Inspection</h3>
          </div>

          {activeContainer ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-dark p-6 rounded-3xl border border-dark-border">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Box size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">{activeContainer.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Target Pod / Service</p>
                  </div>
                </div>

                <div className="p-6 bg-dark/50 rounded-3xl border border-dark-border">
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-6 border-b border-dark-border pb-3 flex items-center gap-2">
                    <Key size={12} />
                    Injected Secrets
                  </p>
                  <div className="space-y-3">
                    {activeContainer.secrets.map(s => (
                      <div key={s} className="flex justify-between items-center group/item">
                        <span className="text-xs font-mono text-white">{s}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-600 font-mono uppercase">{activeProvider?.id.toUpperCase()}</span>
                          <button className="p-1.5 bg-dark border border-dark-border rounded-lg text-gray-700 opacity-0 group-hover/item:opacity-100 hover:text-white transition-all">
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark/50 rounded-2xl border border-dark-border">
                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mb-1">Health</p>
                    <p className="text-xs text-green-500 font-bold">100%</p>
                  </div>
                  <div className="p-4 bg-dark/50 rounded-2xl border border-dark-border">
                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mb-1">Uptime</p>
                    <p className="text-xs text-white font-bold">12d 4h</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-dark-border">
                <button className="w-full py-4 bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                  <Terminal size={14} />
                  Exec Shell
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 bg-dark border border-dark-border rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={32} className="text-gray-700" />
              </div>
              <p className="text-gray-600 text-sm font-mono uppercase tracking-widest">Select a workload to <br/> view secret attachment details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
