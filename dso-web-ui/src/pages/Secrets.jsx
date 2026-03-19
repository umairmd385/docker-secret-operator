import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield, Key, Eye, EyeOff, MoreHorizontal, Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { dsoApi } from '../services/api';

export default function Secrets() {
  const { activeProvider, addNotification, environment } = usePlatform();
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [confirmReveal, setConfirmReveal] = useState(null);

  useEffect(() => {
    const fetchSecrets = async () => {
      setLoading(true);
      if (activeProvider) {
        const data = await dsoApi.getSecrets(activeProvider.id, environment);
        setSecrets(data);
      }
      setLoading(false);
    };
    fetchSecrets();
  }, [activeProvider, environment]);

  const handleReveal = async (name) => {
    if (revealedSecrets[name]) {
      setRevealedSecrets(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return;
    }
    
    setConfirmReveal(name);
  };

  const confirmSecretReveal = async () => {
    const name = confirmReveal;
    const data = await dsoApi.getSecretValue(name, environment);
    setRevealedSecrets(prev => ({ ...prev, [name]: data.value }));
    setConfirmReveal(null);
    addNotification(`Security: Secret "${name}" was revealed. Will auto-hide in 10s.`);
    
    setTimeout(() => {
      setRevealedSecrets(prev => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }, 10000);
  };

  const copyToClipboard = (val, id) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification("Copied to clipboard.");
  };

  const filteredSecrets = secrets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.container.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center bg-dark-card border border-dark-border p-8 rounded-[32px]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest bg-dark px-3 py-1 rounded-full border border-dark-border">Provider Active</span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{activeProvider?.name || 'Local'}</h1>
          </div>
          <p className="text-gray-500 text-sm">Managing {secrets.length} secrets in {activeProvider?.region || 'global'} region.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-dark border border-dark-border px-6 py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-white transition-all flex items-center gap-2">
            <RefreshCw size={16} />
            Force Sync
          </button>
          <button className="brand-gradient px-8 py-3 rounded-2xl text-white font-bold flex items-center gap-2 shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all">
            <Plus size={18} />
            New Secret
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-dark-border flex justify-between items-center bg-white/[0.01]">
          <div className="relative flex items-center gap-4 px-6 py-3 rounded-2xl bg-dark border border-dark-border w-full max-w-lg focus-within:border-brand-cyan transition-colors">
            <Search size={18} className="text-gray-600" />
            <input 
              type="text" 
              placeholder="Search by secret name or container..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-dark border border-dark-border rounded-xl text-[10px] font-mono text-gray-500">
              ROWS: {filteredSecrets.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border bg-white/[0.01]">
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secret Mapping</th>
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stored At</th>
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Workload</th>
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Injection</th>
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secret Value</th>
                <th className="py-6 px-10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="py-6 px-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="py-8 px-10"><div className="h-4 bg-dark rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredSecrets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center opacity-70">
                    <div className="w-16 h-16 bg-dark border border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-600">
                      <Key size={24} />
                    </div>
                    <p className="text-white font-bold mb-1">No Secrets Found</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Adjust your search or register new credentials</p>
                  </td>
                </tr>
              ) : filteredSecrets.map((s) => (
                <tr key={s.name} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-dark border border-dark-border flex items-center justify-center text-gray-600 group-hover:text-brand-cyan group-hover:border-brand-cyan/30 transition-all">
                        <Key size={18} />
                      </div>
                      <div>
                        <span className="text-sm text-white font-bold block mb-0.5">{s.name}</span>
                        <span className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">{s.last_sync}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/5 px-2 py-1 rounded border border-brand-purple/10 uppercase tracking-wider">{s.provider}</span>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                      <span className="text-xs text-gray-300 font-mono">{s.container}</span>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/5 border border-brand-purple/10 px-2 py-1 rounded w-fit">{s.injection_method}</span>
                      {s.injection_method === 'FILE' && s.mount_path && (
                        <span className="text-[9px] text-gray-500 font-mono italic max-w-[120px] truncate" title={s.mount_path}>{s.mount_path}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-4 bg-dark px-4 py-2.5 rounded-xl border border-dark-border w-fit">
                      <span className="text-xs font-mono text-gray-400 w-32 truncate">
                        {revealedSecrets[s.name] ? revealedSecrets[s.name] : '••••••••••••••••'}
                      </span>
                      <div className="flex items-center gap-2 border-l border-dark-border pl-4">
                        <button 
                          onClick={() => handleReveal(s.name)}
                          className="text-gray-600 hover:text-white transition-colors p-1"
                        >
                          {revealedSecrets[s.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {revealedSecrets[s.name] && (
                          <button 
                            onClick={() => copyToClipboard(revealedSecrets[s.name], s.name)}
                            className="text-gray-600 hover:text-white transition-colors p-1"
                          >
                            {copiedId === s.name ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit
                        ${s.status === 'Synced' ? 'bg-green-500/10 text-green-500' : s.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 animate-pulse' : 'bg-red-500/10 text-red-500'}
                      `} title={s.error || ''}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Synced' ? 'bg-green-500' : s.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        {s.status}
                      </div>
                      {s.error && <span className="text-[9px] text-red-400 font-mono w-32 truncate" title={s.error}>{s.error}</span>}
                    </div>
                  </td>
                  <td className="py-8 px-10 text-right">
                    <button className="p-2 hover:bg-dark rounded-lg text-gray-600 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reveal Confirmation Modal */}
      {confirmReveal && (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-dark-card border border-dark-border rounded-[40px] max-w-md w-full p-10 shadow-3xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-red-500/20">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-white text-center mb-4 uppercase tracking-tight">Security Caution</h3>
            <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
              You are about to reveal sensitive secret information. This action will be <span className="text-brand-blue font-bold">logged</span> in the DSO audit trail. Handle with extreme care.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmReveal(null)}
                className="py-4 rounded-2xl bg-dark border border-dark-border text-gray-400 font-bold hover:text-white transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSecretReveal}
                className="py-4 rounded-2xl bg-red-500 text-white font-bold shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all text-sm"
              >
                Reveal Secret
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
