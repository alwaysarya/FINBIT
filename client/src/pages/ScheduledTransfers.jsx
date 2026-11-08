import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const ScheduledTransfers = () => {
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '', scheduledDate: '' });
  const [schedules, setSchedules] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { user } = useContext(AuthContext);

  const fetchSchedules = () => {
    api.get('/scheduled').then(res => setSchedules(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scheduled', form);
      setToast({ message: 'Transfer scheduled successfully!', type: 'success' });
      setForm({ toAccountNumber: '', amount: '', description: '', scheduledDate: '' });
      fetchSchedules();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to schedule', type: 'error' });
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/scheduled/${id}/cancel`);
      setToast({ message: 'Schedule cancelled', type: 'success' });
      fetchSchedules();
    } catch (err) {
      setToast({ message: 'Cancel failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>📅 Scheduled Transfers</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Balance: ₹{user?.account?.balance?.toLocaleString()}</p>

      {/* Create Form */}
      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Schedule a Future Transfer</h3>
        <div className="input-group">
          <label>Receiver Account Number</label>
          <input value={form.toAccountNumber} onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })} placeholder="e.g. 1497915647" required />
        </div>
        <div className="input-group">
          <label>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Date (Future)</label>
          <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Rent" />
        </div>
        <button onClick={handleCreate} style={{ background: '#6366f1' }}>Schedule Transfer</button>
      </div>

      {/* Schedules List */}
      <h2>⏰ Upcoming Schedules</h2>
      {schedules.length === 0 ? <p>No scheduled transfers.</p> : (
        <div className="txn-list">
          {schedules.map(s => (
            <div key={s._id} className="txn-item" style={{ borderLeft: `4px solid ${s.status === 'pending' ? '#f59e0b' : s.status === 'completed' ? '#10b981' : '#ef4444'}` }}>
              <div className="txn-details">
                <p className="txn-type">₹{s.amount} to A/C {s.toAccountNumber}</p>
                <p className="txn-date">📅 {new Date(s.scheduledDate).toLocaleDateString()} — {s.description}</p>
                <p className="txn-desc">Status: {s.status}</p>
              </div>
              {s.status === 'pending' && (
                <button onClick={() => handleCancel(s._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledTransfers;
