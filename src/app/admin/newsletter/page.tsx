'use client';

import { useEffect, useState } from 'react';

interface SubscriberStats {
  active: number;
  pending: number;
  unsubscribed: number;
  total: number;
}

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const adminKey = sessionStorage.getItem('admin-key');
    if (adminKey === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-key', password);
      setAuthenticated(true);
      setPassword('');
      fetchStats();
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/newsletter/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-key');
    setAuthenticated(false);
    setStats(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 bg-surface rounded-lg border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-white/5 border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-accent/50"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent hover:bg-accent/90 text-background font-medium rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Newsletter Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-surface rounded-lg border border-border">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Total Subscribers</h3>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-6 bg-surface rounded-lg border border-border">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Active</h3>
              <p className="text-3xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="p-6 bg-surface rounded-lg border border-border">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-6 bg-surface rounded-lg border border-border">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Unsubscribed</h3>
              <p className="text-3xl font-bold text-red-400">{stats.unsubscribed}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="p-6 bg-surface rounded-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium">
                Export Subscribers (CSV)
              </button>
              <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium">
                Send Test Email
              </button>
              <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium">
                View Campaign History
              </button>
              <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium">
                Create Campaign
              </button>
            </div>
          </div>

          <div className="p-6 bg-surface rounded-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Filters</h2>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                All (Active + Pending)
              </button>
              <button className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                Active Only
              </button>
              <button className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                Pending Confirmation
              </button>
              <button className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                Unsubscribed
              </button>
              <button className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                Bounced
              </button>
            </div>
          </div>

          <div className="p-6 bg-surface rounded-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            <p className="text-sm text-gray-400">
              Campaign history and logs will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
