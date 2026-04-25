import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductTrackingSimulation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    
    if (ref) {
      setRefCode(ref);
      // Simulate click tracking
      axios.get(`http://localhost:5000/api/tracking/${ref}`)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [location]);

  const handlePurchase = async () => {
    if (!refCode) return alert('No referral code present. Buy anyway?');
    
    try {
      // Simulate a purchase of $100
      await axios.post('http://localhost:5000/api/tracking/conversion', {
        referralCode: refCode,
        amount: 100
      });
      setPurchased(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      alert('Error recording conversion');
    }
  };

  if (loading) return <div className="app-container" style={{alignItems: 'center', justifyContent: 'center'}}>Loading Store...</div>;

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h2>Mock Product Store</h2>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>
          {refCode ? `You were referred by: ${refCode}` : 'You arrived directly (no affiliate).'}
        </p>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>Premium Package</h3>
          <h1 style={{ color: 'var(--accent-success)' }}>$100.00</h1>
        </div>

        {!purchased ? (
          <button className="btn-primary" onClick={handlePurchase} style={{ width: '100%', fontSize: '1.1rem' }}>
            Buy Now
          </button>
        ) : (
          <div style={{ color: 'var(--accent-success)', padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px' }}>
            <h3>Purchase Successful!</h3>
            <p>Commission has been credited.</p>
            <p className="subtitle">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
