import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, DollarSign, MousePointerClick, TrendingUp,
  BrainCircuit, ShieldAlert, BarChart2, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const PIE_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#8b5cf6', '#0891b2'];

const axisStyle = { fill: '#94a3b8', fontSize: 12 };
const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' };

function LoadingDots() {
  return <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '0.5rem 0' }}>
    <span className="pulse-loading" /><span className="pulse-loading" /><span className="pulse-loading" />
  </div>;
}

export default function AdminDashboard({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const [data, setData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [fraud, setFraud] = useState<any>(null);
  const [predRange, setPredRange] = useState<'7' | '30'>('7');
  const [aiLoading, setAiLoading] = useState(true);
  const [fraudLoading, setFraudLoading] = useState(true);
  const [predLoading, setPredLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, payRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/admin', config),
          axios.get('http://localhost:5000/api/payments', config)
        ]);
        setData(dashRes.data);
        setPayments(payRes.data);
      } catch (e) { console.error(e); }

      try {
        const aiRes = await axios.get('http://localhost:5000/api/ai/insights', config);
        setInsights(aiRes.data.insights);
      } catch (e) { setInsights(['Unable to load insights.']); }
      setAiLoading(false);

      try {
        const predRes = await axios.get('http://localhost:5000/api/ai/predict', config);
        setPrediction(predRes.data);
      } catch (e) { console.error(e); }
      setPredLoading(false);

      try {
        const fraudRes = await axios.get('http://localhost:5000/api/ai/fraud', config);
        setFraud(fraudRes.data);
      } catch (e) { console.error(e); }
      setFraudLoading(false);
    };
    load();
  }, []);

  const approvePayment = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/${id}/approve`, {}, config);
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'PAID' } : p));
    } catch (e) { console.error(e); }
  };

  if (!data) return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LoadingDots />
    </div>
  );

  const predData = predRange === '7' ? prediction?.prediction7 : prediction?.prediction30;

  return (
    <div className="app-container">
      <Sidebar role={user.role} setUser={setUser} />
      <main className="main-content">

        <div className="page-header">
          <div>
            <h1 style={{ fontSize: '1.75rem' }}><span className="text-gradient">Brand Dashboard</span></h1>
            <p className="subtitle">Real-time influencer performance & revenue analytics</p>
          </div>
          <button className="btn-outline ripple" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* ── Stat Cards ─── */}
        <div className="dashboard-grid">
          <StatCard title="Total Revenue" value={`$${data.metrics.revenue.toFixed(2)}`}
            icon={<DollarSign size={22} color="#2563eb" />} trend="12%" trendUp bg="rgba(37,99,235,0.08)" />
          <StatCard title="Commissions Paid" value={`$${data.metrics.commissions.toFixed(2)}`}
            icon={<DollarSign size={22} color="#dc2626" />} bg="rgba(220,38,38,0.08)" />
          <StatCard title="Total Clicks" value={data.metrics.clicks}
            icon={<MousePointerClick size={22} color="#16a34a" />} trend="5%" trendUp bg="rgba(22,163,74,0.08)" />
          <StatCard title="Influencers" value={data.metrics.influencers}
            icon={<Users size={22} color="#8b5cf6" />} bg="rgba(139,92,246,0.08)" />
          <StatCard title="Total Sales" value={data.metrics.salesCount}
            icon={<BarChart2 size={22} color="#ea580c" />} bg="rgba(234,88,12,0.08)" />
          <StatCard title="Conversion Rate" value={`${data.metrics.conversionRate}%`}
            icon={<TrendingUp size={22} color="#0891b2" />} trend="2.1%" trendUp bg="rgba(8,145,178,0.08)" />
        </div>

        {/* ── Chart Row 1: Sales Line + Revenue Pie ─── */}
        <div className="charts-grid">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#2563eb" /> Sales Over Time (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.salesOverTime}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5}
                  dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 7, fill: '#dc2626' }} name="Revenue ($)" />
                <Line type="monotone" dataKey="sales" stroke="#dc2626" strokeWidth={2}
                  dot={{ fill: '#dc2626', r: 3 }} name="Sales Count" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem' }}>Revenue Split</h3>
            {data.revenueSplit.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data.revenueSplit} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={90} innerRadius={45} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {data.revenueSplit.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <p>No revenue data yet.<br />Track a conversion to see the split.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Chart Row 2: Top Influencers Bar ─── */}
        <div className="charts-row">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#2563eb" /> Top Influencers by Sales
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.topInfluencers} barGap={6}>
                <defs>
                  <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="sales" fill="url(#barBlue)" radius={[6, 6, 0, 0]} name="Sales" />
                <Bar dataKey="clicks" fill="url(#barRed)" radius={[6, 6, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Rate Gauge */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Conversion Rate</h3>
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={[
                    { value: parseFloat(data.metrics.conversionRate) },
                    { value: Math.max(0, 10 - parseFloat(data.metrics.conversionRate)) }
                  ]} startAngle={210} endAngle={-30}
                    innerRadius={60} outerRadius={80} dataKey="value" strokeWidth={0}>
                    <Cell fill="#2563eb" />
                    <Cell fill="rgba(37,99,235,0.1)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{data.metrics.conversionRate}%</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Conversion</span>
              </div>
            </div>
            <p className="subtitle" style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              {parseFloat(data.metrics.conversionRate) >= 3 ? '✅ Above benchmark (3%)' : '⚠️ Below 3% benchmark'}
            </p>
          </div>
        </div>

        {/* ── AI Section ─── */}
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BrainCircuit color="#2563eb" /> AI Intelligence Center
        </h2>
        <div className="ai-grid">

          {/* Option B: Insights */}
          <div className="glass-panel ai-panel">
            <h4 style={{ marginBottom: '1rem', color: '#2563eb' }}>📊 Performance Insights</h4>
            {aiLoading ? <LoadingDots /> : insights.map((ins, i) => (
              <div key={i} className="ai-insight-item" style={{ animationDelay: `${i * 0.1}s` }}>{ins}</div>
            ))}
          </div>

          {/* Option A: Sales Prediction */}
          <div className="glass-panel ai-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: '#2563eb' }}>🔮 Sales Prediction</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['7', '30'] as const).map(r => (
                  <button key={r} className={predRange === r ? 'btn-primary' : 'btn-outline'} ripple
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => setPredRange(r)}>{r}d</button>
                ))}
              </div>
            </div>
            {predLoading || !prediction ? <LoadingDots /> : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(37,99,235,0.06)', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#2563eb' }}>${prediction.summary[predRange === '7' ? 'next7Days' : 'next30Days']}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Predicted Revenue</div>
                  </div>
                  <div style={{ background: 'rgba(22,163,74,0.06)', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#16a34a' }}>{prediction.summary.confidence}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confidence</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={predData}>
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={predRange === '30' ? 4 : 0} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} width={40} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v}`} />
                    <Line type="monotone" dataKey="predicted" stroke="#2563eb" strokeWidth={2}
                      dot={false} name="Predicted ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

          {/* Option C: Fraud Detection */}
          <div className="glass-panel ai-panel">
            <h4 style={{ marginBottom: '1rem', color: fraud?.status === 'clean' ? '#16a34a' : '#dc2626' }}>
              <ShieldAlert size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Fraud Detection
            </h4>
            {fraudLoading ? <LoadingDots /> : (
              <>
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', textAlign: 'center',
                  background: fraud?.status === 'clean' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                  border: `1px solid ${fraud?.status === 'clean' ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: fraud?.status === 'clean' ? '#16a34a' : '#dc2626' }}>
                    {fraud?.status === 'clean' ? '✅ All Clear' : `🚨 ${fraud?.alerts?.length} Anomaly Detected`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>{fraud?.summary}</div>
                </div>
                {fraud?.alerts?.length > 0 ? fraud.alerts.map((a: any, i: number) => (
                  <div key={i} className={`fraud-alert ${a.severity}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className={`badge badge-${a.severity}`} style={{ marginBottom: 4, display: 'inline-block' }}>{a.type}</span>
                    <div>{a.message}</div>
                  </div>
                )) : (
                  <p className="subtitle" style={{ textAlign: 'center', padding: '1rem 0' }}>No suspicious activity detected.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Payments Table ─── */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.25rem' }}>💰 Payment Management</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr><th>Influencer</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.influencer?.user?.name || 'N/A'}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>${p.amount.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(p.date).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td>
                      {p.status === 'PENDING' ? (
                        <button className="btn-success ripple" onClick={() => approvePayment(p.id)}>Approve & Pay</button>
                      ) : (
                        <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>✓ Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No payments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
