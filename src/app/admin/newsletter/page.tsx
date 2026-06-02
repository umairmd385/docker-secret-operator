'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Mail, Clock, XCircle, Download, Send, History, 
  Plus, LogOut, ShieldCheck, Search, CheckCircle2, X,
  LayoutDashboard, Settings, Activity, ArrowRight
} from 'lucide-react';

// ... (types and interfaces remain identical)
interface SubscriberStats {
  active: number;
  pending: number;
  unsubscribed: number;
  total: number;
}

interface Subscriber {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'blocked' | 'bounced';
  source: string;
  created_at: string;
}

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState<'none' | 'test-email' | 'new-campaign' | 'history'>('none');
  const [testEmail, setTestEmail] = useState('');
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [campaignStatus, setCampaignStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [campaignHistory, setCampaignHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscribers'>('dashboard');

  useEffect(() => {
    const adminKey = sessionStorage.getItem('admin-key');
    if (adminKey) {
      verifyTokenAndFetchData(adminKey);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyTokenAndFetchData = async (key: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/newsletter/stats', { headers: { 'x-admin-key': key } });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setAuthenticated(true);
        sessionStorage.setItem('admin-key', key);
        
        const subRes = await fetch('/api/admin/newsletter/subscribers', { headers: { 'x-admin-key': key } });
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscribers(subData.subscribers);
        }
      } else {
        setAuthError('Invalid admin credentials.');
        sessionStorage.removeItem('admin-key');
        setAuthenticated(false);
      }
    } catch {
      setAuthError('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) verifyTokenAndFetchData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-key');
    setAuthenticated(false);
    setStats(null);
    setSubscribers([]);
  };

  const handleExportCSV = () => {
    const headers = ['Email,Status,Source,Join Date'];
    const rows = subscribers.map(s => `${s.email},${s.status},${s.source},${s.created_at}`);
    const csv = headers.concat(rows).join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestEmailStatus('sending');
    try {
      const res = await fetch('/api/admin/newsletter/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': sessionStorage.getItem('admin-key') || '' },
        body: JSON.stringify({ email: testEmail })
      });
      if (res.ok) {
        setTestEmailStatus('success');
        setTimeout(() => { setActiveModal('none'); setTestEmailStatus('idle'); setTestEmail(''); }, 2000);
      } else {
        setTestEmailStatus('error');
      }
    } catch { setTestEmailStatus('error'); }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignStatus('sending');
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': sessionStorage.getItem('admin-key') || '' },
        body: JSON.stringify({ title: campaignTitle, subject: campaignSubject, content: campaignContent })
      });
      if (res.ok) {
        setCampaignStatus('success');
        setTimeout(() => { setActiveModal('none'); setCampaignStatus('idle'); setCampaignTitle(''); setCampaignSubject(''); setCampaignContent(''); }, 3000);
      } else {
        setCampaignStatus('error');
      }
    } catch { setCampaignStatus('error'); }
  };

  const fetchCampaignHistory = async () => {
    setLoadingHistory(true);
    setActiveModal('history');
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', { headers: { 'x-admin-key': sessionStorage.getItem('admin-key') || '' } });
      if (res.ok) {
        const data = await res.json();
        setCampaignHistory(data.campaigns);
      }
    } catch (e) { console.error(e); } finally { setLoadingHistory(false); }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'sent':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>;
      case 'pending':
      case 'draft':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> {status}</span>;
      case 'unsubscribed':
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">{status}</span>;
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (search && !sub.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading && !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"></motion.div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-accent/20 to-purple-500/20 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 text-accent" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">DSO Admin</h1>
            <p className="text-sm text-gray-400 mt-2 text-center">Secure access to newsletter orchestration.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Access Token</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all group-hover:border-white/20"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {authError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
                  {authError}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              type="submit" disabled={loading || !password}
              className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : (
                <>Enter Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row font-sans selection:bg-accent/30 selection:text-white text-white">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black/50 border-r border-white/10 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-tight">DSO CRM</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('subscribers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'subscribers' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Users className="w-5 h-5" /> Subscribers
          </button>
          <button onClick={fetchCampaignHistory} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-400 hover:text-white hover:bg-white/5">
            <History className="w-5 h-5" /> Campaigns
          </button>
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-rose-400 transition-colors mt-auto font-medium">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
          
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {activeTab === 'dashboard' ? 'Platform Overview' : 'Subscriber Management'}
              </h1>
              <p className="text-gray-400 text-sm">Monitor your community growth and orchestrate campaigns.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveModal('test-email')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Send className="w-4 h-4 text-gray-400" /> Test
              </button>
              <button onClick={() => setActiveModal('new-campaign')} className="px-5 py-2 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2">
                <Plus className="w-4 h-4" /> Blast Campaign
              </button>
            </div>
          </header>

          {activeTab === 'dashboard' && stats && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Base', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
                { label: 'Opt-outs', value: stats.unsubscribed, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                  <div className={`w-12 h-12 ${stat.bg} ${stat.border} border rounded-2xl flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                  <Activity className="w-4 h-4 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Directory</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" placeholder="Search emails..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-full sm:w-auto">
                  {['all', 'active', 'pending', 'unsubscribed'].map((f) => (
                    <button
                      key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${filter === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                
                <button onClick={handleExportCSV} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors group" title="Export CSV">
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {filteredSubscribers.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">Silence in the vault</h3>
                  <p className="text-gray-500 text-sm">No subscribers match your current filters.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Subscriber</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Source</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSubscribers.map((sub, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.5) }}
                        key={sub.id} className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                              {sub.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{sub.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400 tracking-wide">{sub.source}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-right tabular-nums">{formatDate(sub.created_at)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal('none')} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header Effect */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
              
              <button onClick={() => setActiveModal('none')} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20 bg-black/50 p-1.5 rounded-full backdrop-blur-md">
                <X className="w-5 h-5" />
              </button>

              {activeModal === 'test-email' && (
                <div className="p-8">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-6">
                    <Send className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Fire a Test</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">Validate your SMTP or Resend configuration by blasting a diagnostic email before running a massive campaign.</p>
                  <form onSubmit={handleSendTestEmail} className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Address</label>
                      <input type="email" required value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="hello@skycloudops.in" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
                    </div>
                    {testEmailStatus === 'success' && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Trajectory confirmed. Email sent.</div>}
                    {testEmailStatus === 'error' && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2"><XCircle className="w-4 h-4"/> System failure. Check logs.</div>}
                    <div className="pt-2 flex justify-end gap-3">
                      <button type="button" onClick={() => setActiveModal('none')} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Abort</button>
                      <button type="submit" disabled={testEmailStatus === 'sending'} className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2">
                        {testEmailStatus === 'sending' ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : 'Launch Test'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeModal === 'new-campaign' && (
                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <Send className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Orchestrate Campaign</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">Broadcast a message to your entire active subscriber base. This action cannot be undone.</p>
                  <form onSubmit={handleSendCampaign} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Internal Designation</label>
                        <input type="text" required value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="e.g. v2.0 Release" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Inbox Subject Line</label>
                        <input type="text" required value={campaignSubject} onChange={(e) => setCampaignSubject(e.target.value)} placeholder="Big news for DSO..." className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payload (HTML/Text)</label>
                      <textarea required value={campaignContent} onChange={(e) => setCampaignContent(e.target.value)} placeholder="Write your message here..." className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors h-40 font-mono text-sm resize-none custom-scrollbar" />
                    </div>
                    {campaignStatus === 'success' && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Blast initiated successfully.</div>}
                    {campaignStatus === 'error' && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2"><XCircle className="w-4 h-4"/> Blast failed to launch.</div>}
                    <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
                      <button type="button" onClick={() => setActiveModal('none')} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Abort</button>
                      <button type="submit" disabled={campaignStatus === 'sending'} className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-accent text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
                        {campaignStatus === 'sending' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Execute Blast'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeModal === 'history' && (
                <div className="flex flex-col h-full max-h-[85vh]">
                  <div className="p-8 border-b border-white/5 bg-black/20">
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <History className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Campaign Logs</h2>
                    <p className="text-gray-400">Historical record of all executed broadcasts.</p>
                  </div>
                  <div className="overflow-y-auto p-0 bg-black/40">
                    {loadingHistory ? (
                      <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Accessing archives...</p>
                      </div>
                    ) : campaignHistory.length === 0 ? (
                      <div className="p-20 text-center flex flex-col items-center">
                        <History className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-gray-400">No campaigns recorded in the archive.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 sticky top-0 backdrop-blur-md">
                          <tr>
                            <th className="px-8 py-4 font-semibold text-xs uppercase tracking-wider">Designation</th>
                            <th className="px-8 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                            <th className="px-8 py-4 font-semibold text-xs uppercase tracking-wider text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {campaignHistory.map((c) => (
                            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-8 py-5 font-medium text-gray-200">{c.title}</td>
                              <td className="px-8 py-5">{getStatusBadge(c.status)}</td>
                              <td className="px-8 py-5 text-gray-500 text-right tabular-nums">{formatDate(c.sent_at || c.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

