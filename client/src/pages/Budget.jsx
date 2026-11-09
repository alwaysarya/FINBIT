import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, PieChart } from 'lucide-react';

const Budget = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: 'Food', limit: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchBudgets = () => api.get('/budget').then(res => setBudgets(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchBudgets(); }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await api.post('/budget', { category: form.category, limit: Number(form.limit) });
      setMsg('Budget set successfully!');
      setForm({ category: 'Food', limit: '' });
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set budget');
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
            <PieChart size={32} color="#DBA030" /> Budget Tracker
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Set monthly budgets for different categories and track your spending.</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSet} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Set Monthly Budget</h3>
            
            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Category</label>
            <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem', cursor: 'pointer' }}
            >
              <option value="Food">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Rent">Rent & Bills</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Monthly Limit (₹)</label>
            <input 
              type="number" 
              value={form.limit} 
              onChange={(e) => setForm({ ...form, limit: e.target.value })} 
              placeholder="e.g. 5000" 
              required 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem' }} 
            />

            <button type="submit" style={{ width: '100%', background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              Set Budget
            </button>
          </form>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>My Budgets</h2>
          {budgets.length === 0 ? (
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No budgets set yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {budgets.map(b => {
                const percent = Math.min((b.spent / b.limit) * 100, 100);
                const isOver = percent > 80;
                return (
                  <div key={b._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A1A' }}>{b.category}</p>
                      <p style={{ fontWeight: 700, color: isOver ? '#EF4444' : '#10B981' }}>₹{b.spent} / ₹{b.limit}</p>
                    </div>
                    <div style={{ height: '10px', background: '#F0F0F0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: isOver ? '#EF4444' : '#DBA030', borderRadius: '5px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Budget;
