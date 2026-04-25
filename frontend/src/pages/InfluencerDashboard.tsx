import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign, MousePointerClick, ShoppingCart, Link as LinkIcon,
  Copy, TrendingUp, BrainCircuit
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' };

function LoadingDots() {
  return <div style={{ display: 'flex', gap: 4, padding: '0.5rem 0' }}>
    <span className="pulse-loading" /><span className="pulse-loading" /><span className="pulse-loading" />
  </div>;
}

export default function InfluencerDashboard({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const [data, setData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, payRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/influencer', config),
          axios.get('http://localhost:5000/api/payments', config),
        ]);
        setData(dashRes.data);
        setPayments(payRes.data);
      } catch (e) { console.error(e); }

      try {
        const aiRes = await axios.get('http://localhost:5000/api/ai/insights', config);
        setInsights(aiRes.data.insights);
      } catch (e) { setInsights(['Unable to load insights.']); }
      setInsightsLoading(false);
    };
    load();
  }, []);

  const copyLink = () => {
    if (data?.metrics?.referralCode) {
      navigator.clipboard.writeText(`http://localhost:5173/product?ref=${data.metrics.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LoadingDots />
    </div>
  );

  return (
    <div className="app-container">
      <Sidebar role={user.role} setUser={setUser} />
      <main className="main-content">

        <div className="page-header">
          <div>
            <h1 style={{ fontSize: '1.75rem' }}><span className="text-gradient">My Dashboard</span></h1>
            <p className="subtitle">Welcome back, {user.name}. Track your performance and earnings.</p>
          </div>
        </div>

        {/* Affiliate Link Card */}
        <div className="glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <LinkIcon size={18} color="#2563eb" /> Your Affiliate Link
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
              http://localhost:5173/product?ref=<strong style={{ color: '#2563eb' }}>{data.metrics.referralCode}</strong>
            </p>
          </div>
          <button className="btn-primary ripple" onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <Copy size={16} /> {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-grid">
          <StatCard title="Total Clicks" value={data.metrics.clicks}
            icon={<MousePointerClick size={22} color="#2563eb" />} trend="8%" trendUp bg="rgba(37,99,235,0.08)" />
          <StatCard title="Conversions" value={data.metrics.salesCount}
            icon={<ShoppingCart size={22} color="#16a34a" />} bg="rgba(22,163,74,0.08)" />
          <StatCard title="Conversion Rate" value={`${data.metrics.conversionRate}%`}
            icon={<TrendingUp size={22} color="#8b5cf6" />} bg="rgba(139,92,246,0.08)" />
          <StatCard title="Revenue Generated" value={`$${data.metrics.revenueGenerated.toFixed(2)}`}
            icon={<DollarSign size={22} color="#ea580c" />} bg="rgba(234,88,12,0.08)" />
          <StatCard title="My Earnings (10%)" value={`$${data.metrics.commissionEarned.toFixed(2)}`}
            icon={<DollarSign size={22} color="#dc2626" />} trend="15%" trendUp bg="rgba(220,38,38,0.08)" />
        </div>

        {/* Sales Over Time Chart */}
        <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#2563eb" /> My Performance (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5}
                  dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 7, fill: '#dc2626' }} name="Revenue ($)" />
                <Line type="monotone" dataKey="commission" stroke="#16a34a" strokeWidth={2}
                  dot={{ fill: '#16a34a', r: 3 }} name="My Earnings ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="glass-panel ai-panel">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
              <BrainCircuit size={18} /> AI Optimization Tips
            </h4>
            {insightsLoading ? <LoadingDots /> : insights.map((ins, i) => (
              <div key={i} className="ai-insight-item" style={{ animationDelay: `${i * 0.15}s` }}>{ins}</div>
            ))}
          </div>
        </div>

        {/* Tables */}
        <div className="charts-row">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem' }}>Recent Sales</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Sale Amount</th><th>Commission</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.recentSales.map((sale: any) => (
                    <tr key={sale.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(sale.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 700 }}>${sale.amount.toFixed(2)}</td>
                      <td style={{ color: '#16a34a', fontWeight: 700 }}>${sale.commissionEarned.toFixed(2)}</td>
                      <td><span className={`badge badge-${sale.status.toLowerCase()}`}>{sale.status}</span></td>
                    </tr>
                  ))}
                  {data.recentSales.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No sales yet. Share your link above!
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem' }}>Payout History</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(p.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>${p.amount.toFixed(2)}</td>
                      <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No payouts yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
