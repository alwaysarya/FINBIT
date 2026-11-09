import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, PiggyBank } from 'lucide-react';

const RecurringDeposit = () => {
  const navigate = useNavigate();
  const { updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ monthlyAmount: '', durationMonths: 12 });
  const [rds, setRds] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchRDs = () => api.get('/rd').then(res => setRds(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchRDs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.post('/rd/create', { monthlyAmount: Number(form.monthlyAmount), durationMonths: Number(form.durationMonths) });
      updateBalance(res.data.newBalance);
      setMsg('RD created successfully! First installment deducted.');
      setForm({ monthlyAmount: '', durationMonths: 12 });
      fetchRDs();
    } catch (err) {
      setError(err.response?.data?.message || 'RD creation failed');
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
            <PiggyBank size={32} color="#DBA030" /> Recurring Deposit (RD)
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Save monthly and earn 7% interest. Minimum: ₹500/month</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleCreate} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Create New RD</h3>
            
            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Monthly Amount (₹)</label>
            <input 
              type="number" 
              value={form.monthlyAmount} 
              onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })} 
              placeholder="e.g. 1000" 
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
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
            </select>

            <button type="submit" style={{ width: '100%', background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              Start RD
            </button>
          </form>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>My RDs</h2>
          {rds.length === 0 ? (
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No RD created yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rds.map(rd => (
                <div key={rd._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', borderLeft: '4px solid #DBA030', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A1A' }}>₹{rd.monthlyAmount}/month for {rd.durationMonths} months</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.2rem' }}>Maturity: {new Date(rd.maturityDate).toLocaleDateString()}</p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>Rate: {rd.interestRate}% | Status: {rd.status}</p>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#10B981' }}>₹{rd.maturityAmount}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecurringDeposit;
