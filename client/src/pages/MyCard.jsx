import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, Unlock, ShieldCheck } from 'lucide-react';

const MyCard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [card, setCard] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/card').then(res => setCard(res.data)).catch(err => console.log(err));
  }, []);

  const handleFreeze = async () => {
    try {
      const res = await api.put('/card/freeze');
      setCard({ ...card, isFrozen: res.data.isFrozen });
      setMsg(res.data.message);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  if (!card) return <div style={{ minHeight: '100vh', background: '#FCF9F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading Card...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={32} color="#DBA030" /> My Debit Card
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Manage your virtual debit card and control its usage.</p>

          {msg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>
              {msg}
            </motion.div>
          )}

          {/* Premium 3D Card */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 90 }} 
            animate={{ opacity: 1, rotateY: 0 }} 
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ 
              background: card.isFrozen ? 'linear-gradient(135deg, #555 0%, #222 100%)' : 'linear-gradient(135deg, #DBA030 0%, #F2C879 100%)',
              borderRadius: '24px', 
              padding: '2rem', 
              maxWidth: '420px', 
              aspectRatio: '1.6', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              color: card.isFrozen ? '#AAA' : '#1A1A1A',
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
              border: card.isFrozen ? '1px solid #444' : '1px solid rgba(255,255,255,0.5)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}
          >
            <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <ShieldCheck size={32} />
              <span style={{ fontWeight: 700, fontSize: '1.2rem', fontStyle: 'italic' }}>{card.cardType}</span>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '1.5rem', letterSpacing: '3px', fontFamily: 'monospace', fontWeight: 700 }}>{card.cardNumber}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>Card Holder</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{user.name.toUpperCase()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>Expires</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{card.expiry}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>CVV</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>***</p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '420px' }}>
            <button 
              onClick={handleFreeze} 
              style={{ 
                flex: 1, 
                background: card.isFrozen ? '#10B981' : '#EF4444', 
                color: '#FFF', 
                border: 'none', 
                padding: '1.2rem', 
                borderRadius: '16px', 
                fontWeight: 700, 
                fontSize: '1.05rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {card.isFrozen ? <><Unlock size={20} /> Unfreeze Card</> : <><Lock size={20} /> Freeze Card</>}
            </button>
          </div>

          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem', maxWidth: '420px' }}>
            {card.isFrozen ? 'Your card is currently blocked. No transactions will be allowed.' : 'Your card is active and ready to use.'}
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default MyCard;
