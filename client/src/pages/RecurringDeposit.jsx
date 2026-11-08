import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const RecurringDeposit = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ monthlyAmount: '', durationMonths: 12 });
  const [rds, setRds] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchRDs = () => {
    api.get('/rd').then(res => setRds(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchRDs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/rd/create', { monthlyAmount: Number(form.monthlyAmount), durationMonths: Number(form.durationMonths) });
      updateBalance(res.data.newBalance);
      setToast({ message: res.data.message, type: 'success' });
      setForm({ monthlyAmount: '', durationMonths: 12 });
      fetchRDs();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'RD creation failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💰 Recurring Deposit (RD)</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Save monthly and earn 7% interest. Min: ₹500/month</p>

      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Create New RD</h3>
        <div className="input-group">
          <label>Monthly Amount (₹)</label>
          <input type="number" value={form.monthlyAmount} onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })} placeholder="e.g. 1000" required />
        </div>
        <div className="input-group">
          <label>Duration</label>
          <select value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
          </select>
        </div>
        <button onClick={handleCreate} style={{ background: '#10b981' }}>Start RD</button>
      </div>

      <h2>My RDs</h2>
      {rds.length === 0 ? <p>No RD created yet.</p> : (
        <div className="txn-list">
          {rds.map(rd => (
            <div key={rd._id} className="txn-item" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="txn-details">
                <p className="txn-type">₹{rd.monthlyAmount}/month for {rd.durationMonths} months</p>
                <p className="txn-date">Maturity: {new Date(rd.maturityDate).toLocaleDateString()}</p>
                <p className="txn-desc">Rate: {rd.interestRate}% | Status: {rd.status}</p>
              </div>
              <div className="txn-amount text-green">₹{rd.maturityAmount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringDeposit;
