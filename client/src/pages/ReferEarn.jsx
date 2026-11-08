import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const ReferEarn = () => {
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    api.get('/referral').then(res => setStats(res.data)).catch(err => console.log(err));
  }, []);

  const copyToClipboard = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.referralCode);
    setToast({ message: 'Referral code copied!', type: 'success' });
  };

  if (!stats) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🎁 Refer & Earn</h1>
      
      <div className="card" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', maxWidth: '600px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Invite friends. Earn ₹100 each!</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>Share your code. When your friend signs up, you both get ₹100 cashback.</p>
        
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.2rem' }}>YOUR REFERRAL CODE</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: 'white' }}>{stats.referralCode}</p>
          </div>
          <button onClick={copyToClipboard} style={{ background: 'white', color: '#8b5cf6', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Copy</button>
        </div>
      </div>

      <div className="card-grid">
        <div className="card" style={{ borderTop: '4px solid #10b981' }}>
          <p className="card-title">Total Referrals</p>
          <h2 className="card-value">{stats.totalReferrals}</h2>
        </div>
        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <p className="card-title">Total Earnings</p>
          <h2 className="card-value">₹ {stats.earnings}</h2>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem' }}>👥 Friends You Referred</h2>
      {stats.referrals.length === 0 ? <p>No referrals yet. Share your code to start earning!</p> : (
        <div className="txn-list">
          {stats.referrals.map((r, i) => (
            <div key={i} className="txn-item">
              <div className="txn-icon">👤</div>
              <div className="txn-details">
                <p className="txn-type">{r.name}</p>
                <p className="txn-date">Joined: {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="txn-amount text-green">+ ₹100</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferEarn;
