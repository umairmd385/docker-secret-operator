import React, { useState } from 'react';
import { Search, Filter, Terminal, Calendar, User, Server, AlertCircle, CheckCircle2, Info, RefreshCw } from 'lucide-react';

const events = [
  { id: 1, severity: 'error', category: 'Provider Error', service: 'AWS Secrets Manager', msg: 'Authentication token expired or invalid', time: '14:45:12', date: '2026-03-16' },
  { id: 2, severity: 'warning', category: 'Sync Warning', service: 'db_password (mysql-db)', msg: 'Sync delayed by 12s due to high latency', time: '14:40:05', date: '2026-03-16' },
  { id: 3, severity: 'error', category: 'Injection Error', service: 'cache-node', msg: 'Failed to mount volume /etc/secrets/storage_key', time: '14:38:22', date: '2026-03-16' },
  { id: 4, severity: 'info', category: 'Agent System', service: 'DSO Agent', msg: 'DSO Agent heartbeat successful', time: '14:35:00', date: '2026-03-16' },
  { id: 5, severity: 'error', category: 'Sync Error', service: 'redis_key (cache-node)', msg: 'Provider rate-limit reached', time: '14:30:15', date: '2026-03-16' },
  { id: 6, severity: 'info', category: 'Sync Success', service: 'vault-prod', msg: 'Sync completed (12 keys verified)', time: '14:25:44', date: '2026-03-16' },
  { id: 7, severity: 'info', category: 'Injection Success', service: 'job-processor', msg: 'Secrets actively verified in workload', time: '14:20:10', date: '2026-03-16' },
];

const SeverityBadge = ({ severity, category }) => {
  const styles = {
    info: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1.5 w-fit ${styles[severity] || styles.info}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'error' ? 'bg-red-500 animate-pulse' : severity === 'warning' ? 'bg-yellow-500' : 'bg-brand-blue'}`}></span>
      {category}
    </span>
  );
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Secret Events Timeline</h1>
          <p className="text-gray-500">Audit logs and synchronization history for all managed secrets.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-dark-card border border-dark-border px-4 py-2 rounded-xl">
            <Search size={16} className="text-gray-600" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-transparent border-none outline-none text-sm text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-dark-card border border-dark-border px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-[32px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-border bg-white/2">
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Severity</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/2 transition-colors group">
                <td className="py-5 px-8">
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{event.time}</span>
                    <span className="text-[10px] text-gray-600 font-mono tracking-tighter">{event.date}</span>
                  </div>
                </td>
                <td className="py-5 px-8">
                  <SeverityBadge severity={event.severity} category={event.category} />
                </td>
                <td className="py-5 px-8">
                  <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/5 px-2 py-1 rounded border border-brand-cyan/10">{event.service}</span>
                </td>
                <td className={`py-5 px-8 text-sm transition-colors ${event.severity === 'error' ? 'text-red-400 font-bold' : 'text-gray-300 group-hover:text-white'}`}>
                  {event.msg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-white/2 border-t border-dark-border flex justify-center">
          <button className="text-xs font-bold text-gray-500 hover:text-brand-cyan transition-colors flex items-center gap-2">
            <RefreshCw size={14} />
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
}
