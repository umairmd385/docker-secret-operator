import React, { useState } from 'react';
import { Settings as SettingsIcon, Terminal, Globe, Shield, Bell, Save, Copy, Check } from 'lucide-react';

const SettingItem = ({ label, description, children, cliCommand }) => {
  const [copied, setCopied] = useState(false);

  const copyCLI = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 hover:bg-white/2 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{label}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-1 lg:max-w-md">
          {children}
        </div>
      </div>
      
      {cliCommand && (
        <div className="mt-8 bg-dark p-4 rounded-xl border border-dark-border flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-gray-600" />
            <code className="text-xs font-mono text-brand-cyan">{cliCommand}</code>
          </div>
          <button 
            onClick={copyCLI}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default function Settings() {
  const [syncInterval, setSyncInterval] = useState(300);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Platform Settings</h1>
          <p className="text-gray-500">Configure global operator behavior and CLI integrations.</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-[32px] overflow-hidden shadow-2xl divide-y divide-dark-border">
        {/* Agent Config */}
        <SettingItem 
          label="Synchronization Interval" 
          description="How often the DSO agent polls for secret updates from providers."
          cliCommand={`dso config sync --interval ${syncInterval}s`}
        >
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="30" 
              max="3600" 
              value={syncInterval} 
              onChange={(e) => setSyncInterval(e.target.value)}
              className="flex-1 h-1.5 bg-dark border-none rounded-lg appearance-none cursor-pointer accent-brand-cyan"
            />
            <span className="text-white font-mono font-bold w-16 text-right">{syncInterval}s</span>
          </div>
        </SettingItem>

        <SettingItem 
          label="Auto-Rotation Grace Period" 
          description="Buffer time allowed before forcing container restarts on secret rotation."
          cliCommand="dso config rotation --grace-period 5m"
        >
          <select className="w-full bg-dark border border-dark-border text-gray-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-brand-blue transition-colors">
            <option>Immediate</option>
            <option>1 Minute</option>
            <option selected>5 Minutes</option>
            <option>15 Minutes</option>
          </select>
        </SettingItem>

        <SettingItem 
          label="Audit Log Retention" 
          description="Duration to store local sync logs and event history."
          cliCommand="dso logs prune --retention 30d"
        >
          <div className="flex gap-4">
            {['7d', '14d', '30d', '90d'].map((period) => (
              <button 
                key={period}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                  period === '30d' 
                    ? 'brand-gradient text-white border-transparent' 
                    : 'bg-dark text-gray-500 border-dark-border hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </SettingItem>

        <SettingItem 
          label="Cloud Provider Mode" 
          description="Switch between managed polling and webhook-based secret injection."
          cliCommand="dso provider set-mode polling"
        >
          <div className="flex items-center gap-2 bg-dark p-1 rounded-xl border border-dark-border w-fit">
            <button className="px-6 py-2 rounded-lg bg-brand-cyan text-white text-xs font-bold shadow-2xl">Polling</button>
            <button className="px-6 py-2 rounded-lg text-gray-500 text-xs font-bold hover:text-white transition-all">Webhook</button>
          </div>
        </SettingItem>
      </div>

      <div className="flex justify-end pt-8">
        <button className="brand-gradient px-12 py-4 rounded-2xl text-white font-bold flex items-center gap-2 shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
