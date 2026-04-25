import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

export default function Login({ setUser }: { setUser: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('INFLUENCER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/influencer');
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container auth-container">
      <div className="glass-panel auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h2><span className="text-gradient">Affiliate</span> Flow</h2>
          <p className="subtitle">Track your influence, maximize your earnings.</p>
        </div>

        {error && <div style={{ color: error.includes('successful') ? 'var(--accent-success)' : 'var(--accent-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" className="input-control" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select className="input-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="INFLUENCER">Influencer</option>
                  <option value="ADMIN">Brand Admin</option>
                </select>
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-outline" style={{ border: 'none' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
