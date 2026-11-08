import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const MyCard = () => {
  const { user } = useContext(AuthContext);
  const [card, setCard] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    api.get('/card').then(res => setCard(res.data)).catch(err => console.log(err));
  }, []);

  const handleFreeze = async () => {
    try {
      const res = await api.put('/card/freeze');
      setCard({ ...card, isFrozen: res.data.isFrozen });
      setToast({ message: res.data.message, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update card', type: 'error' });
    }
  };

  if (!card) return <div className="page">Loading Card...</div>;

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💳 My Debit Card</h1>

      {/* Virtual Card UI */}
      <div className={`virtual-card ${card.isFrozen ? 'frozen' : ''}`}>
        <div className="card-top">
          <span className="card-chip">💳</span>
          <span className="card-type">{card.cardType}</span>
        </div>
        <div className="card-number">{card.cardNumber}</div>
        <div className="card-bottom">
          <div>
            <p className="card-label">Card Holder</p>
            <p className="card-value">{user.name.toUpperCase()}</p>
          </div>
          <div>
            <p className="card-label">Expires</p>
            <p className="card-value">{card.expiry}</p>
          </div>
          <div>
            <p className="card-label">CVV</p>
            <p className="card-value">***</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card-controls">
        <button onClick={handleFreeze} style={{ background: card.isFrozen ? '#10b981' : '#ef4444' }}>
          {card.isFrozen ? '🔓 Unfreeze Card' : '🔒 Freeze Card'}
        </button>
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem' }}>
          {card.isFrozen ? 'Your card is temporarily blocked. No transactions will be allowed.' : 'Your card is active and ready to use.'}
        </p>
      </div>
    </div>
  );
};

export default MyCard;
