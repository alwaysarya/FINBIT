import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Rewards = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchPoints = () => {
    api.get('/rewards').then(res => setPoints(res.data.rewardPoints)).catch(err => console.log(err));
  };

  useEffect(() => { fetchPoints(); }, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/rewards/redeem', { pointsToRedeem: Number(redeemAmount) });
      updateBalance(res.data.newBalance);
      setPoints(res.data.newPoints);
      setToast({ message: res.data.message, type: 'success' });
      setRedeemAmount('');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to redeem', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🎁 FINBIT Rewards</h1>

      {/* Points Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', maxWidth: '400px' }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Your Reward Points</p>
        <h2 style={{ fontSize: '3rem', color: 'white', margin: '0.5rem 0' }}>{points}</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Worth: ₹{(points / 10).toFixed(2)}</p>
      </div>

      {/* Info */}
      <p style={{ color: '#94a3b8', marginTop: '2rem', marginBottom: '1rem' }}>
        💡 Earn 1 point for every ₹100 you spend or transfer. Redeem 10 points for ₹1.
      </p>

      {/* Redeem Form */}
      <div className="form">
        <h3>Redeem Points</h3>
        <div className="input-group">
          <label>Points to Redeem (Minimum 100)</label>
          <input 
            type="number" 
            placeholder="e.g. 500" 
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
            required 
          />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          Cash Value: ₹{(redeemAmount / 10 || 0).toFixed(2)}
        </p>
        <button onClick={handleRedeem} style={{ background: '#f59e0b', color: '#fff' }}>Redeem Now</button>
      </div>
    </div>
  );
};

export default Rewards;
