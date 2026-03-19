import React, { useState } from 'react';
import { Search, Bell, Github, CheckCircle, Info, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function Navbar() {
  const { notifications, environment, changeEnvironment, globalError } = usePlatform();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-dark/80 backdrop-blur-xl border-b border-dark-border px-8 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center flex-1 max-w-2xl gap-8">
        {/* Global Search */}
        <div className={`
          flex items-center flex-1 gap-3 px-5 py-2.5 rounded-2xl bg-dark border transition-all duration-300
          ${isSearchFocused ? 'border-brand-blue ring-1 ring-brand-blue/20' : 'border-dark-border'}
        `}>
          <Search size={18} className={isSearchFocused ? 'text-brand-blue' : 'text-gray-600'} />
          <input 
            type="text" 
            placeholder="Search secrets, containers..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full font-medium"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg">
            <span className="text-[10px] text-gray-500 font-mono">⌘</span>
            <span className="text-[10px] text-gray-500 font-mono">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {globalError && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl" title={globalError}>
             <AlertTriangle size={14} className="text-red-500" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Error</span>
          </div>
        )}
        
        {/* Environment Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-gray-400 hover:text-white transition-all hover:border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest">{environment}</span>
            <ChevronDown size={14} />
          </button>
          <div className="absolute top-full right-0 mt-2 w-32 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {['dev', 'stage', 'prod'].map(env => (
              <button 
                key={env}
                onClick={() => changeEnvironment(env)}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${environment === env ? 'text-brand-cyan' : 'text-gray-500 hover:text-white'}`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* DSO Status */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-brand-cyan/5 border border-brand-cyan/10 rounded-xl">
          <CheckCircle size={14} className="text-brand-cyan animate-pulse" />
          <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest leading-none">Healthy</span>
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-dark-card border border-dark-border rounded-xl text-gray-500 hover:text-white transition-all hover:border-white/10 relative"
          >
            <Bell size={20} />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-cyan rounded-full border-2 border-dark-card shadow-[0_0_10px_rgba(57,197,187,0.5)]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-16 right-0 w-80 bg-dark-card border border-dark-border rounded-[32px] shadow-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="p-6 border-b border-dark-border bg-white/[0.01] flex justify-between items-center text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest">Platform Events</h4>
                <button onClick={() => setShowNotifications(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X size={14}/>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {!notifications || notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-3 opacity-50">
                    <Info size={24} className="mx-auto text-gray-700" />
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">No recent events</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-6 border-b border-dark-border hover:bg-white/[0.02] transition-colors group">
                      <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 shrink-0 shadow-[0_0_8px_rgba(57,197,187,0.8)]"></div>
                        <div>
                          <p className="text-xs text-white font-bold mb-1 leading-relaxed">{n.msg}</p>
                          <span className="text-[9px] text-gray-600 font-mono uppercase">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <a 
          href="https://github.com/umairmd385/docker-secret-operator" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-dark-card border border-dark-border rounded-xl text-gray-500 hover:text-white transition-all hover:border-white/10"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  );
}
