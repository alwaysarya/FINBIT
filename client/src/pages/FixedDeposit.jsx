import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, TrendingUp } from 'lucide-react';

const FixedDeposit = () => {
  const navigate = useNavigate();
  const { updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ amount: '', durationMonths: '12' });
  const [fds, setFds] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchFDs = () => api.get('/fd').then(res => setFds(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchFDs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.post('/fd/create', { amount: Number(form.amount), durationMonths: Number(form.durationMonths) });
      updateBalance(res.data.newBalance);
      setMsg(`FD Created! Maturity Amount: ₹${res.data.fd.maturityAmount}`);
      setForm({ amount: '', durationMonths: '12' });
      fetchFDs();
    } catch (err) {
      setError(err.response?.data?.message || 'FD creation failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Landmark size={32} color="#DBA030" /> Fixed Deposit (FD)
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Invest your money and earn guaranteed returns at 6.5% p.a.</p>

          {/* Current Balance & Rate Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#666', fontSize: '0.9rem', fontWeight: 600 }}>Current Balance</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A1A', marginTop: '0.5rem' }}>₹{useContext(AuthContext).user?.account?.balance?.toLocaleString()}</h2>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #DBA030 0%, #F2C879 100%)', padding: '1.5rem', borderRadius: '20px', color: '#FFF' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>Interest Rate</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>6.5% p.a.</h2>
            </div>
          </div>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleCreate} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Create New FD</h3>
            
            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Amount (Min ₹1000)</label>
            <input 
              type="number" 
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })} 
              placeholder="Enter amount" 
              required 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem' }} 
            />

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Duration</label>
            <select 
              value={form.durationMonths} 
              onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', cursor: 'pointer' }}
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
            </select>

            <button type="submit" style={{ width: '100%', background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <TrendingUp size={20} /> Create FD
            </button>
          </form>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>My FDs</h2>
          {fds.length === 0 ? (
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No FDs created yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {fds.map(fd => (
                <div key={fd._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', borderLeft: '4px solid #DBA030', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A1A' }}>₹{fd.amount} ({fd.durationMonths} Months)</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.2rem' }}>Maturity: {new Date(fd.maturityDate).toLocaleDateString()}</p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>Status: {fd.status}</p>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#10B981' }}>₹{fd.maturityAmount}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FixedDeposit;
