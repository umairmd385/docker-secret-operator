import React, { useState, useEffect } from 'react';
import { Database, Cloud, Lock, Server, Plus, CheckCircle, RefreshCcw, MoreVertical, Settings, Activity } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { dsoApi } from '../services/api';

const ProviderIcon = ({ id, size = 18 }) => {
  const icons = { aws: Cloud, azure: Lock, vault: Server, local: Database };
  const Icon = icons[id] || Database;
  return <Icon size={size} />;
};

export default function Providers() {
  const { activeProvider, switchProvider, addNotification, environment } = usePlatform();
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await dsoApi.getAllProviders(environment);
      setAllProviders(data);
      setLoading(false);
    };
    fetch();
  }, [environment]);

  const handleSwitch = async (id) => {
    addNotification(`Connecting to ${id.toUpperCase()}...`);
    await switchProvider(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Secret Providers</h1>
          <p className="text-gray-500">Manage connections to your external secret management systems.</p>
        </div>
        <button className="brand-gradient px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all">
          <Plus size={18} strokeWidth={3} />
          Register Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-dark-card border border-dark-border h-80 rounded-[40px] animate-pulse"></div>
          ))
        ) : allProviders.map((p) => (
          <div 
            key={p.id} 
            className={`bg-dark-card border rounded-[40px] p-10 hover:border-white/10 transition-all group relative overflow-hidden
              ${activeProvider?.id === p.id ? 'border-brand-cyan/40 shadow-2xl shadow-brand-cyan/5' : 'border-dark-border'}
            `}
          >
            {activeProvider?.id === p.id && (
              <div className="absolute top-0 right-10 bg-brand-cyan text-white px-6 py-2 rounded-b-2xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-full duration-500">
                ACTIVE
              </div>
            )}
            
            <div className="flex justify-between items-start mb-10">
              <div className={`p-5 rounded-3xl bg-dark border border-dark-border transition-all duration-500 group-hover:scale-110
                ${p.id === 'aws' ? 'text-brand-purple' : 
                  p.id === 'azure' ? 'text-brand-blue' : 
                  p.id === 'vault' ? 'text-brand-cyan' : 'text-gray-500'}
              `}>
                <ProviderIcon id={p.id} size={32} />
              </div>
              <button className="text-gray-700 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{p.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <p className="text-[10px] text-gray-600 font-mono tracking-widest">{p.region || p.vault_name || 'LOCAL CLUSTER'}</p>
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${p.status === 'Connected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {p.status === 'Connected' ? '✅ Connected' : '❌ Failed'}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-mono uppercase tracking-widest">Available</span>
                <span className="text-white font-bold">{p.secrets_count} Secrets</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-mono uppercase tracking-widest">Auth Status</span>
                <span className={`font-mono font-bold tracking-tighter ${p.status === 'Connected' ? 'text-white' : 'text-red-400 max-w-[120px] truncate text-right'}`} title={p.auth_status}>{p.auth_status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-mono uppercase tracking-widest">Last Fetch</span>
                <span className="text-gray-400 font-mono">{p.last_successful_fetch}</span>
              </div>
            </div>

            <div className="flex gap-4">
              {activeProvider?.id === p.id ? (
                <button 
                  className="flex-1 py-4 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                >
                  <Activity size={12} />
                  Connected
                </button>
              ) : (
                <button 
                  onClick={() => handleSwitch(p.id)}
                  className="flex-1 py-4 bg-dark border border-dark-border text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  Connect
                </button>
              )}
              <button className="p-4 bg-dark border border-dark-border text-gray-600 hover:text-white rounded-2xl hover:border-white/10 transition-all">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}

        <button className="bg-dark/20 border-2 border-dashed border-dark-border rounded-[40px] p-10 flex flex-col items-center justify-center gap-6 hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-20 h-20 rounded-3xl bg-dark border border-dark-border flex items-center justify-center text-gray-700 group-hover:text-brand-blue group-hover:scale-110 transition-all">
            <Plus size={40} strokeWidth={3} />
          </div>
          <div className="text-center group-relative z-10">
            <p className="text-white font-black uppercase tracking-widest mb-1">New Connection</p>
            <p className="text-[10px] text-gray-600 font-mono tracking-tighter">Add Custom Provider</p>
          </div>
        </button>
      </div>
    </div>
  );
}
