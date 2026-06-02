'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Mail, 
  Clock, 
  XCircle, 
  Download, 
  Send, 
  History, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Search,
  CheckCircle2
} from 'lucide-react';

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
      // Fetch stats to verify token
      const res = await fetch('/api/admin/newsletter/stats', {
        headers: { 'x-admin-key': key }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setAuthenticated(true);
        sessionStorage.setItem('admin-key', key);
        
        // Fetch subscribers
        const subRes = await fetch('/api/admin/newsletter/subscribers', {
          headers: { 'x-admin-key': key }
        });
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscribers(subData.subscribers);
        }
      } else {
        setAuthError('Invalid admin password');
        sessionStorage.removeItem('admin-key');
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to authenticate:', error);
      setAuthError('An error occurred while authenticating');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      verifyTokenAndFetchData(password);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-key');
    setAuthenticated(false);
    setStats(null);
    setSubscribers([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><CheckCircle2 className="w-3 h-3" /> Active</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock className="w-3 h-3" /> Pending</span>;
      case 'unsubscribed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><XCircle className="w-3 h-3" /> Unsubscribed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">{status}</span>;
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (search && !sub.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading && !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-sm text-gray-400 mt-2 text-center">Enter your administrator password to manage newsletter subscribers and campaigns.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-gray-700 bg-background text-accent focus:ring-accent/50"
                />
                Show password
              </label>
            </div>
            
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
                {authError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-background font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Newsletter Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-transparent hover:border-border"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-surface rounded-xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
            <div className="p-5 bg-surface rounded-xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
            </div>
            <div className="p-5 bg-surface rounded-xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
            </div>
            <div className="p-5 bg-surface rounded-xl border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Unsubscribed</p>
                <p className="text-2xl font-bold text-red-400">{stats.unsubscribed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-surface hover:bg-surface/80 border border-border hover:border-accent/50 rounded-xl transition-all group">
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-accent" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-foreground">New Campaign</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-surface hover:bg-surface/80 border border-border hover:border-accent/50 rounded-xl transition-all group">
            <Send className="w-5 h-5 text-gray-400 group-hover:text-accent" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-foreground">Send Test Email</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-surface hover:bg-surface/80 border border-border hover:border-accent/50 rounded-xl transition-all group">
            <History className="w-5 h-5 text-gray-400 group-hover:text-accent" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-foreground">Campaign History</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-surface hover:bg-surface/80 border border-border hover:border-accent/50 rounded-xl transition-all group">
            <Download className="w-5 h-5 text-gray-400 group-hover:text-accent" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-foreground">Export CSV</span>
          </button>
        </div>

        {/* Subscribers Table */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/30">
            <h2 className="text-lg font-bold text-foreground">Subscriber List</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search emails..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                />
              </div>
              
              <div className="flex bg-background border border-border rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                {['all', 'active', 'pending', 'unsubscribed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize whitespace-nowrap ${
                      filter === f 
                        ? 'bg-surface text-foreground shadow-sm' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                Loading subscribers...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-foreground font-medium mb-1">No subscribers found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-900/50 text-gray-400 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Email Address</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium text-right">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-200">{sub.email}</td>
                      <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                      <td className="px-6 py-4 text-gray-400">
                        <span className="px-2 py-1 bg-gray-800 rounded text-xs">{sub.source}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-right">{formatDate(sub.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
