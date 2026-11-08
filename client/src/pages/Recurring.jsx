import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const Recurring = () => {
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '', frequency: 'monthly', nextRunDate: '' });
  const [list, setList] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchList = () => {
    api.get('/recurring').then(res => setList(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchList(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recurring', form);
      setToast({ message: 'Recurring transfer setup!', type: 'success' });
      setForm({ toAccountNumber: '', amount: '', description: '', frequency: 'monthly', nextRunDate: '' });
      fetchList();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/recurring/${id}/cancel`);
      setToast({ message: 'Cancelled', type: 'success' });
      fetchList();
    } catch (err) {
      setToast({ message: 'Failed to cancel', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🔁 Recurring Transfers (Auto-Pay)</h1>

      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Setup New Auto-Pay</h3>
        <div className="input-group">
          <label>Receiver Account</label>
          <input value={form.toAccountNumber} onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. House Rent" />
        </div>
        <div className="input-group">
          <label>Frequency</label>
          <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="input-group">
          <label>Start Date</label>
          <input type="date" value={form.nextRunDate} onChange={(e) => setForm({ ...form, nextRunDate: e.target.value })} required />
        </div>
        <button onClick={handleCreate} style={{ background: '#6366f1' }}>Setup Auto-Pay</button>
      </div>

      <h2>📋 My Recurring Transfers</h2>
      {list.length === 0 ? <p>No recurring transfers yet.</p> : (
        <div className="txn-list">
          {list.map(r => (
            <div key={r._id} className="txn-item" style={{ borderLeft: `4px solid ${r.status === 'active' ? '#10b981' : '#ef4444'}` }}>
              <div className="txn-details">
                <p className="txn-type">₹{r.amount} {r.frequency} to {r.toAccountNumber}</p>
                <p className="txn-date">Next Run: {new Date(r.nextRunDate).toLocaleDateString()} • {r.description}</p>
                <p className="txn-desc">Status: {r.status}</p>
              </div>
              {r.status === 'active' && (
                <button onClick={() => handleCancel(r._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recurring;
