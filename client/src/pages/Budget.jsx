import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: 'Food', limit: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchBudgets = () => {
    api.get('/budget').then(res => setBudgets(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budget', { category: form.category, limit: Number(form.limit) });
      setToast({ message: 'Budget set!', type: 'success' });
      setForm({ category: 'Food', limit: '' });
      fetchBudgets();
    } catch (err) {
      setToast({ message: 'Failed to set budget', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>📊 Budget Tracker</h1>

      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Set Monthly Budget</h3>
        <div className="input-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Food">Food & Dining</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent & Bills</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-group">
          <label>Monthly Limit (₹)</label>
          <input type="number" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} placeholder="e.g. 5000" required />
        </div>
        <button onClick={handleSet} style={{ background: '#6366f1' }}>Set Budget</button>
      </div>

      <h2>My Budgets</h2>
      <div className="txn-list">
        {budgets.map(b => {
          const percent = Math.min((b.spent / b.limit) * 100, 100);
          return (
            <div key={b._id} className="txn-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p className="txn-type">{b.category}</p>
                <p style={{ color: percent > 80 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>₹{b.spent} / ₹{b.limit}</p>
              </div>
              <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: percent > 80 ? '#ef4444' : '#10b981', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
