import React, { useState } from 'react';
import { Database, Shield, Zap, Box, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Node = ({ icon: Icon, label, status, subtext, onClick, isActive, color }) => (
  <div 
    onClick={onClick}
    className={`
      flex flex-col items-center cursor-pointer transition-all duration-300 relative
      ${isActive ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}
    `}
  >
    <div className={`
      w-20 h-20 rounded-[28px] flex items-center justify-center border shadow-2xl transition-all
      ${isActive ? `bg-${color}/20 border-${color} shadow-${color}/20` : 'bg-dark-card border-dark-border'}
    `}>
      <Icon className={isActive ? `text-${color}` : 'text-gray-400'} size={32} />
    </div>
    <div className="mt-4 text-center">
      <h5 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</h5>
      <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">{status}</p>
    </div>
    {isActive && (
      <motion.div 
        layoutId="active-glow"
        className={`absolute inset-0 -z-10 bg-${color}/10 blur-3xl rounded-full`}
      />
    )}
  </div>
);

const Connection = ({ active }) => (
  <div className="flex-1 h-[2px] bg-dark-border relative overflow-hidden hidden lg:block">
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-brand-cyan to-transparent"
        />
      )}
    </AnimatePresence>
  </div>
);

export default function Architecture() {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { 
      id: 'provider', 
      icon: Database, 
      label: 'AWS Secret Manager', 
      status: 'Source', 
      color: 'brand-purple',
      metadata: {
        type: 'External SaaS',
        region: 'us-east-1',
        secrets: '12 managed',
        uptime: '99.99%',
        last_fetch: '4s ago'
      }
    },
    { 
      id: 'dso', 
      icon: Shield, 
      label: 'DSO Operator', 
      status: 'Agent', 
      color: 'brand-cyan',
      metadata: {
        type: 'Daemon',
        version: 'v1.2.4',
        cache: 'In-Memory (AES-256)',
        workers: '4 active',
        mode: 'Polling'
      }
    },
    { 
      id: 'compose', 
      icon: Zap, 
      label: 'Docker Compose', 
      status: 'Runtime', 
      color: 'brand-blue',
      metadata: {
        type: 'Orchestrator',
        file: 'docker-compose.yaml',
        services: '5 total',
        network: 'dso-internal',
        wrapper: 'dso-binary'
      }
    },
    { 
      id: 'containers', 
      icon: Box, 
      label: 'App Containers', 
      status: 'Leaf', 
      color: 'brand-cyan',
      metadata: {
        type: 'Workload',
        count: '3 instances',
        env_injected: '8 keys',
        isolation: 'Pure In-Memory',
        last_sync: '12s ago'
      }
    },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Secret Flow Map</h1>
        <p className="text-gray-500">Visualizing the lifecycle of secrets from provider to container.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center lg:flex-row gap-8 lg:gap-4 relative px-12">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <Node 
              {...node} 
              isActive={selectedNode?.id === node.id}
              onClick={() => setSelectedNode(node)}
            />
            {i < nodes.length - 1 && <Connection active={true} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50"
          >
            <div className="glass p-8 rounded-[32px] border border-white/10 shadow-2xl relative">
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-${selectedNode.color}/20 text-${selectedNode.color}`}>
                  <selectedNode.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedNode.label}</h3>
                  <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">{selectedNode.status} Node</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(selectedNode.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-1">{key.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-300 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-20 flex justify-center gap-12">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
          <span>Active Flow</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-dark-border"></div>
          <span>Idle Lane</span>
        </div>
      </div>
    </div>
  );
}
