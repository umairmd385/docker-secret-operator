import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  Lock, 
  Server, 
  Box, 
  ChevronRight, 
  Terminal, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Zap,
  RotateCcw,
  Copy,
  Check,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const providers = [
  { id: 'aws', name: 'AWS Secrets Manager', icon: Cloud, color: 'brand-purple' },
  { id: 'vault', name: 'HashiCorp Vault', icon: Server, color: 'brand-cyan' },
  { id: 'azure', name: 'Azure Key Vault', icon: Lock, color: 'brand-blue' },
  { id: 'local', name: 'Local Secrets', icon: Database, color: 'gray-500' },
];

const containers = [
  { id: 'mysql', name: 'mysql_container', image: 'mysql:8' },
  { id: 'api', name: 'backend_api', image: 'node:20-alpine' },
  { id: 'redis', name: 'redis_cache', image: 'redis:latest' },
];

export default function Playground() {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [secretName, setSecretName] = useState('db_password');
  const [secretValue, setSecretValue] = useState('');
  const [showValue, setShowValue] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isInjecting, setIsInjecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setStep(1);
    setSelectedProvider(null);
    setSelectedContainer(null);
    setTerminalLogs([]);
    setIsInjecting(false);
    setSecretValue('');
  };

  const startInjection = (provider, container) => {
    if (!provider || !container) return;
    
    setIsInjecting(true);
    setTerminalLogs([]);
    
    const logs = [
      `[INFO] Connecting to ${provider.name}...`,
      `[SYNC] Secret ${secretName} fetched from ${provider.id.toUpperCase()}`,
      `[INJECT] Mapping ${secretName} → ${container.name}`,
      `[SUCCESS] Injection into ${container.name} completed.`
    ];

    logs.forEach((log, i) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (i === logs.length - 1) {
          setTimeout(() => {
            setIsInjecting(false);
            setStep(5);
          }, 1000);
        }
      }, (i + 1) * 800);
    });
  };

  const composeCode = `services:
  ${selectedContainer?.id === 'mysql' ? 'mysql' : selectedContainer?.id === 'api' ? 'app' : 'cache'}:
    image: ${selectedContainer?.image || 'unknown'}
    secrets:
      - ${secretName}

secrets:
  ${secretName}:
    external: true`;

  const copyCode = () => {
    navigator.clipboard.writeText(composeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 uppercase italic">Try DSO Instantly</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Simulate Kubernetes-style secret management for Docker Compose in 30 seconds.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-12 mb-12 relative">
        <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-dark-border -z-10"></div>
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all border-2
              ${step >= s ? 'bg-brand-cyan border-brand-cyan text-dark shadow-[0_0_20px_rgba(57,197,187,0.4)]' : 'bg-dark text-gray-700 border-dark-border'}
            `}
          >
            {step > s ? <CheckCircle2 size={20} /> : s}
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-[40px] overflow-hidden shadow-3xl min-h-[550px] flex flex-col relative group/playground">
        <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover/playground:opacity-100 transition-opacity pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 space-y-8 flex-1 relative z-10"
            >
              <h3 className="text-xs font-black text-brand-cyan uppercase tracking-[0.3em] text-center">Step 01 // Configuration</h3>
              <h2 className="text-3xl font-black text-white text-center uppercase tracking-tighter">Select Secret Provider</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((p) => {
                  const Icon = p.icon;
                  const colorClass = p.color.startsWith('brand-') ? `text-${p.color}` : `text-${p.color}`;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProvider(p);
                        setStep(2);
                      }}
                      className="p-8 rounded-3xl bg-dark border border-dark-border flex items-center gap-6 hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all text-left group"
                    >
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${colorClass}`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-tight">{p.name}</p>
                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">External Backend</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 space-y-8 flex-1 relative z-10"
            >
              <h3 className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] text-center">Step 02 // Credentials</h3>
              <h2 className="text-3xl font-black text-white text-center uppercase tracking-tighter">Define Target Secret</h2>
              <div className="max-w-md mx-auto space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Key Identifier</label>
                  <input 
                    type="text" 
                    value={secretName}
                    onChange={(e) => setSecretName(e.target.value)}
                    className="w-full bg-dark border border-dark-border px-6 py-4 rounded-2xl text-brand-cyan font-mono outline-none focus:border-brand-cyan ring-brand-cyan/20 focus:ring-4 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Plaintext Value</label>
                  <div className="relative">
                    <input 
                      type={showValue ? 'text' : 'password'} 
                      placeholder="e.g. Sup3r_S3cur3_123"
                      className="w-full bg-dark border border-dark-border px-6 py-4 rounded-2xl text-white font-mono outline-none focus:border-brand-blue ring-brand-blue/20 focus:ring-4 transition-all"
                      value={secretValue}
                      onChange={(e) => setSecretValue(e.target.value)}
                    />
                    <button 
                      onClick={() => setShowValue(!showValue)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                      {showValue ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button 
                  disabled={!secretValue}
                  onClick={() => setStep(3)}
                  className="w-full py-5 brand-gradient rounded-2xl text-white font-black uppercase tracking-widest shadow-2xl disabled:opacity-30 disabled:grayscale hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm Injection
                </button>
                <button onClick={() => setStep(1)} className="w-full text-[10px] text-gray-600 font-mono uppercase tracking-widest hover:text-white transition-colors">{'<-'} Change Provider</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 space-y-8 flex-1 relative z-10"
            >
              <h3 className="text-xs font-black text-brand-purple uppercase tracking-[0.3em] text-center">Step 03 // Deployment</h3>
              <h2 className="text-3xl font-black text-white text-center uppercase tracking-tighter">Choose Service Hook</h2>
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {containers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedContainer(c);
                      setStep(4);
                      startInjection(selectedProvider, c);
                    }}
                    className="p-6 rounded-3xl bg-dark border border-dark-border flex items-center justify-between hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-white/5 text-gray-500 group-hover:text-brand-purple transition-colors">
                        <Box size={24} />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-tight">{c.name}</p>
                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">{c.image}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full text-[10px] text-gray-600 font-mono uppercase tracking-widest hover:text-white transition-colors text-center">{'<-'} Back to secret</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 flex-1 flex flex-col justify-center items-center bg-dark relative z-10"
            >
              <div className="w-full max-w-2xl bg-[#090C10] rounded-3xl border border-white/5 shadow-3xl overflow-hidden min-h-[300px] border-brand-cyan/20">
                <div className="flex items-center gap-2 px-6 py-4 bg-white/2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono ml-4 uppercase tracking-[0.2em] font-bold">DSO-INTERNAL: INJECTION_PIPELINE</span>
                </div>
                <div className="p-8 font-mono text-xs space-y-3">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-gray-700 font-black">❯</span>
                      <span className={
                        log.includes('[SUCCESS]') ? 'text-green-400 font-bold' : 
                        log.includes('[SYNC]') ? 'text-brand-cyan' : 
                        log.includes('[INFO]') ? 'text-brand-blue' : 'text-gray-300'
                      }>{log}</span>
                    </div>
                  ))}
                  {isInjecting && (
                    <div className="flex gap-4 items-center">
                      <span className="text-gray-700 font-black">❯</span>
                      <div className="w-2.5 h-5 bg-brand-cyan animate-pulse shadow-[0_0_10px_#39C7BB]"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full">
                  <Zap size={14} className="text-brand-cyan animate-pulse" />
                  <span className="text-[10px] text-brand-cyan font-black uppercase tracking-widest">Live Injection Active</span>
                </div>
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em] animate-pulse">Establishing secure link to {selectedProvider?.name}...</p>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="p-12 space-y-8 flex-1 relative z-10"
            >
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-brand-cyan/10 text-brand-cyan rounded-[32px] flex items-center justify-center mx-auto mb-6 border-2 border-brand-cyan/30 shadow-[0_0_40px_rgba(57,197,187,0.2)]">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Injection Success</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">Native Docker secret mapping completed. Your container is now using the synced credential.</p>
              </div>

              <div className="relative group/code">
                <div className="bg-[#090C10] p-8 rounded-3xl border border-dark-border relative font-mono text-sm leading-relaxed text-gray-400 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre">{composeCode}</pre>
                  <button 
                    onClick={copyCode}
                    className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all opacity-0 group-hover/code:opacity-100 backdrop-blur-md"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <span className="absolute -top-3 left-8 bg-dark px-3 text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em] font-black">docker-compose.yaml [auto_generated]</span>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={reset}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  <RotateCcw size={20} />
                  Reset Flow
                </button>
                <button className="flex-1 py-5 brand-gradient rounded-2xl text-white font-black uppercase tracking-widest shadow-[0_0_30px_rgba(57,197,187,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <Zap size={20} />
                  Ready to Push
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-12 text-gray-700">
        <div className="flex items-center gap-3 group transition-colors hover:text-brand-cyan">
          <Shield size={16} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Zero-Storage Architecture</span>
        </div>
        <div className="flex items-center gap-3 group transition-colors hover:text-brand-blue">
          <Zap size={16} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Real-time Secret Parity</span>
        </div>
      </div>
    </div>
  );
}
