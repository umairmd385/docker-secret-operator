import React, { useState } from 'react';
import { Search, Filter, Terminal, Calendar, User, Server, AlertCircle, CheckCircle2, Info, RefreshCw } from 'lucide-react';

const events = [
  { id: 1, type: 'SUCCESS', msg: 'Provider connected successfully', entity: 'AWS SM', container: '-', time: '14:45:12', date: '2026-03-16' },
  { id: 2, type: 'SYNC', msg: 'Secret rotation scheduled', entity: 'db_password', container: 'mysql-db', time: '14:40:05', date: '2026-03-16' },
  { id: 3, type: 'INJECT', msg: 'Injected secrets into container', entity: 'app-v1', container: 'api-gateway', time: '14:38:22', date: '2026-03-16' },
  { id: 4, type: 'INFO', msg: 'DSO Agent heartbeat', entity: 'system', container: '-', time: '14:35:00', date: '2026-03-16' },
  { id: 5, type: 'ERROR', msg: 'Failed to sync: Timeout', entity: 'redis_key', container: 'cache-node', time: '14:30:15', date: '2026-03-16' },
  { id: 6, type: 'SUCCESS', msg: 'Sync completed (12 keys)', entity: 'vault-prod', container: '-', time: '14:25:44', date: '2026-03-16' },
  { id: 7, type: 'INJECT', msg: 'Secrets verified in workload', entity: 'worker-node', container: 'job-processor', time: '14:20:10', date: '2026-03-16' },
];

const TypeBadge = ({ type }) => {
  const styles = {
    SUCCESS: 'bg-green-500/10 text-green-500 border-green-500/20',
    ERROR: 'bg-red-500/10 text-red-500 border-red-500/20',
    INFO: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    SYNC: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    INJECT: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[type] || styles.INFO}`}>
      {type}
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
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entity</th>
              <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Container</th>
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
                  <TypeBadge type={event.type} />
                </td>
                <td className="py-5 px-8 text-sm text-gray-300 group-hover:text-white transition-colors">{event.msg}</td>
                <td className="py-5 px-8">
                  <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/5 px-2 py-1 rounded">{event.entity}</span>
                </td>
                <td className="py-5 px-8 text-xs text-gray-500 font-mono italic">{event.container}</td>
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
