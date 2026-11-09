import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Zap, Tv, Droplet } from 'lucide-react';

const Bills = () => {
  const navigate = useNavigate();
  const [billType, setBillType] = useState('Mobile Recharge');
  const [billerName, setBillerName] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const { updateBalance } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await api.post('/transaction/pay-bill', { billType, billerName, amount });
      updateBalance(res.data.newBalance);
      setMsg(`✅ Bill paid successfully! New balance: ₹${res.data.newBalance}`);
      setBillerName('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={32} color="#DBA030" /> Bill Payments & Recharge
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Pay your utility bills, mobile recharge, and more securely.</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Bill Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { type: 'Mobile Recharge', icon: Smartphone },
                  { type: 'Electricity Bill', icon: Zap },
                  { type: 'DTH Recharge', icon: Tv },
                  { type: 'Water Bill', icon: Droplet },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setBillType(item.type)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: billType === item.type ? '2px solid #DBA030' : '1px solid #E5E5E5',
                      background: billType === item.type ? '#FCF9F2' : '#FFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                      <item.icon size={24} color={billType === item.type ? '#DBA030' : '#888'} />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: billType === item.type ? '#1A1A1A' : '#666' }}>{item.type}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                {billType === 'Mobile Recharge' ? 'Mobile Number' : 'Consumer Number / ID'}
              </label>
              <input
                type="text"
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
                placeholder="Enter number"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }}
                required
              />
            </div>

            <button type="submit" style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem' }}>
              Pay Now
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Bills;
