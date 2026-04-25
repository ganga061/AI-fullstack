import { Activity, LayoutDashboard, Link as LinkIcon, DollarSign, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role, setUser }: { role: string, setUser: (u: null) => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <Activity size={32} color="var(--accent-primary)" />
        <h2><span className="text-gradient">Affiliate</span></h2>
      </div>

      <div className="nav-links">
        <div className="nav-item active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        {role === 'INFLUENCER' && (
          <div className="nav-item">
            <LinkIcon size={20} />
            <span>My Links</span>
          </div>
        )}
        <div className="nav-item">
          <DollarSign size={20} />
          <span>Payments</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--accent-danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
