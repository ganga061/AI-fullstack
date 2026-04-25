import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';
import ProductTrackingSimulation from './pages/ProductTrackingSimulation';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState<{id: string, role: string, name: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Don't render routes until we've checked localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f4f6f8',
        fontFamily: 'Inter, sans-serif',
        color: '#475569',
        fontSize: '1rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin' : '/influencer') : '/login'} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/admin"
          element={user && user.role === 'ADMIN' ? <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/influencer"
          element={user && user.role === 'INFLUENCER' ? <InfluencerDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route path="/product" element={<ProductTrackingSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
