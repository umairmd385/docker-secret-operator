import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Box, 
  Network, 
  Activity, 
  History, 
  Share2, 
  Settings,
  Zap,
  Shield,
  Cloud,
  Lock,
  Server,
  Database
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShieldCheck, label: 'Secrets', path: '/secrets' },
  { icon: Box, label: 'Containers', path: '/containers' },
  { icon: Network, label: 'Providers', path: '/providers' },
  { icon: Activity, label: 'Observability', path: '/observability' },
  { icon: History, label: 'Events', path: '/events' },
  { icon: Share2, label: 'Architecture', path: '/architecture' },
  { icon: Zap, label: 'Demo Mode', path: '/playground' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { activeProvider, loading } = usePlatform();

  return (
    <aside className="w-80 bg-dark border-r border-dark-border flex flex-col h-full overflow-hidden shrink-0">
      {/* Brand */}
      <div className="p-10 border-b border-dark-border">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-blue/30">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase truncate">DSO <span className="text-brand-cyan">Platform</span></h2>
        </div>
        <p className="text-[10px] text-gray-600 font-mono tracking-widest pl-14">VER 1.2.4-BETA</p>
      </div>

      {/* Provider Status Banner */}
      <div className="mx-6 mt-8 p-6 bg-dark-card border border-dark-border rounded-3xl group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-brand-cyan/5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-700"></div>
        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-3">Active Provider</p>
        
        {loading ? (
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-dark rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-dark rounded"></div>
              <div className="h-2 w-12 bg-dark rounded"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-dark border border-dark-border transition-all duration-500
              ${activeProvider?.id === 'aws' ? 'text-brand-purple border-brand-purple/20' : 
                activeProvider?.id === 'azure' ? 'text-brand-blue border-brand-blue/20' : 
                activeProvider?.id === 'vault' ? 'text-brand-cyan border-brand-cyan/20' : 'text-gray-500 border-dark-border'}
            `}>
              {activeProvider?.id === 'aws' ? <Cloud size={24} /> : 
               activeProvider?.id === 'azure' ? <Lock size={24} /> : 
               activeProvider?.id === 'vault' ? <Server size={24} /> : <Database size={24} />}
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[120px]">{activeProvider?.name || 'Local Store'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Connected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto custom-scrollbar pb-10">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent'}
            `}
          >
            <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
            {item.label === 'Observability' && (
              <span className="ml-auto w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-8 border-t border-dark-border bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
          <span className="text-[10px] text-white font-bold tracking-widest uppercase">Agent Status: Healthy</span>
        </div>
        <div className="bg-dark p-3 rounded-xl border border-dark-border flex items-center justify-between">
          <span className="text-[9px] text-gray-600 font-mono">DSO_CLI_WRAPPER</span>
          <span className="text-[10px] text-brand-blue font-bold">STABLE</span>
        </div>
      </div>
    </aside>
  );
}
