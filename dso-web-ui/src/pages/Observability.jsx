import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Activity, ShieldAlert, Cpu, Database, RefreshCw } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-dark-card border border-dark-border p-6 rounded-3xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 blur-2xl ${color}`}></div>
    <div className="flex gap-4">
      <div className={`p-4 rounded-2xl bg-opacity-10 ${color} text-current`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
        <p className="text-[10px] text-gray-600 font-medium">{subtext}</p>
      </div>
    </div>
  </div>
);

export default function Observability() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate real-time data polling
    const interval = setInterval(() => {
      const now = new Date();
      setSelectedData(prev => {
        const newData = [...prev, {
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          rate: Math.floor(Math.random() * 40) + 40,
          latency: Math.floor(Math.random() * 50) + 90,
        }];
        return newData.slice(-12);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [selectedData, setSelectedData] = useState([
    { time: '14:00:05', rate: 45, latency: 110 },
    { time: '14:00:10', rate: 52, latency: 115 },
    { time: '14:00:15', rate: 48, latency: 105 },
    { time: '14:00:20', rate: 61, latency: 120 },
    { time: '14:00:25', rate: 55, latency: 130 },
    { time: '14:00:30', rate: 67, latency: 112 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Live Observability</h1>
          <p className="text-gray-500">Real-time secret injection telemetry and provider health.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-full border border-brand-cyan/20">
          <RefreshCw size={12} className="animate-spin" />
          <span>Polling Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={Activity} 
          label="Syncs / Min" 
          value="58.2" 
          subtext="Avg over last 5m"
          color="bg-brand-cyan"
        />
        <MetricCard 
          icon={Cpu} 
          label="Injection Success" 
          value="99.98%" 
          subtext="2 failures detected"
          color="bg-brand-blue"
        />
        <MetricCard 
          icon={Database} 
          label="Provider Latency" 
          value="112ms" 
          subtext="AWS SM US-East-1"
          color="bg-brand-purple"
        />
        <MetricCard 
          icon={ShieldAlert} 
          label="Sync Error Rate" 
          value="0.02%" 
          subtext="Within threshold"
          color="bg-red-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-dark-border rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Secret Sync Rate</h3>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">REAL-TIME (SEC)</span>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111820', border: '1px solid #1F2937', borderRadius: '12px'}}
                  labelStyle={{color: '#9CA3AF', marginBottom: '8px'}}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="rate" 
                  stroke="#39C5BB" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#39C5BB', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Provider Latency</h3>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">MS RESPONSE</span>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111820', border: '1px solid #1F2937', borderRadius: '12px'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#0070F3" 
                  strokeWidth={3} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
