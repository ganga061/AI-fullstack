import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login({ setUser }: { setUser: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('INFLUENCER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { timeout: 5000 });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/influencer');
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, { timeout: 5000 });
        setSuccess('Account created! You can now sign in.');
        setIsLogin(true);
        setEmail(email);
        setPassword('');
      }
    } catch (err: any) {
      if (!err.response) {
        // Network error — backend not running
        setError('Cannot connect to server. Please make sure the backend is running:\n→ Open a terminal and run: cd backend && node server.js');
      } else {
        setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="app-container auth-container">
      <div className="auth-box">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #2563eb, #dc2626)', marginBottom: '1rem' }}>
            <Activity size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>
            <span className="text-gradient">Affiliate</span> Flow
          </h2>
          <p className="subtitle">Track your influence, maximize your earnings.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: '#dc2626', fontSize: '0.875rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{error}</p>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)',
            borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '1.25rem'
          }}>
            <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0 }} />
            <p style={{ color: '#16a34a', fontSize: '0.875rem' }}>{success}</p>
          </div>
        )}

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: 'rgba(15,23,42,0.05)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
          {['Sign In', 'Sign Up'].map((tab, i) => (
            <button key={tab}
              onClick={() => { setIsLogin(i === 0); setError(''); setSuccess(''); }}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.2s',
                background: (isLogin ? i === 0 : i === 1) ? '#fff' : 'transparent',
                color: (isLogin ? i === 0 : i === 1) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: (isLogin ? i === 0 : i === 1) ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" className="input-control" placeholder="e.g. Rahul Sharma"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Account Type</label>
                <select className="input-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="INFLUENCER">🎯 Influencer</option>
                  <option value="ADMIN">🏢 Brand Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input-control" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input-control" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary ripple"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', fontSize: '1rem' }}
            disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="pulse-loading" /><span className="pulse-loading" /><span className="pulse-loading" />
              </span>
            ) : (isLogin ? 'Sign In →' : 'Create Account')}
          </button>
        </form>

        {/* Quick Login Hints */}
        {isLogin && (
          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'rgba(37,99,235,0.04)', borderRadius: 10, border: '1px solid rgba(37,99,235,0.1)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button className="btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', textAlign: 'left' }}
                onClick={() => { setEmail('admin@test.com'); setPassword('admin123'); }}>
                🏢 Admin: admin@test.com / admin123
              </button>
              <button className="btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', textAlign: 'left' }}
                onClick={() => { setEmail('influencer@test.com'); setPassword('pass123'); }}>
                🎯 Influencer: influencer@test.com / pass123
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
