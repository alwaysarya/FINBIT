import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Unlock } from 'lucide-react';

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
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={28} /> My Debit Card</h1>

      <motion.div 
        className={`virtual-card ${card.isFrozen ? 'frozen' : ''}`}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CreditCard size={32} color="#A1A1AA" />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', fontStyle: 'italic' }}>{card.cardType}</span>
        </div>
        <div className="card-number">{card.cardNumber}</div>
        <div className="card-bottom">
          <div><p className="card-label">Card Holder</p><p className="card-value">{user.name.toUpperCase()}</p></div>
          <div><p className="card-label">Expires</p><p className="card-value">{card.expiry}</p></div>
          <div><p className="card-label">CVV</p><p className="card-value">***</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: '2rem' }}>
        <motion.button 
          onClick={handleFreeze} 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ background: card.isFrozen ? 'var(--success)' : 'var(--danger)', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {card.isFrozen ? <><Unlock size={18} /> Unfreeze Card</> : <><Lock size={18} /> Freeze Card</>}
        </motion.button>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.9rem' }}>
          {card.isFrozen ? 'Your card is temporarily blocked.' : 'Your card is active and ready to use.'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MyCard;
