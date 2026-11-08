import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Requests = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ payerAccountNumber: '', amount: '', note: '' });
  const [incoming, setIncoming] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchRequests = () => {
    api.get('/request/incoming').then(res => setIncoming(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/request', form);
      setToast({ message: 'Request sent!', type: 'success' });
      setForm({ payerAccountNumber: '', amount: '', note: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send', type: 'error' });
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await api.post(`/request/${id}/${action}`);
      setToast({ message: res.data.message, type: 'success' });
      if (action === 'pay') updateBalance(res.data.newBalance);
      fetchRequests();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💸 Split Bills / Request Money</h1>

      {/* Send Request Form */}
      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Request Money (Send a Request)</h3>
        <div className="input-group">
          <label>Their Account Number</label>
          <input value={form.payerAccountNumber} onChange={(e) => setForm({ ...form, payerAccountNumber: e.target.value })} placeholder="e.g. 1497915647" required />
        </div>
        <div className="input-group">
          <label>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Note (Optional)</label>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Dinner Split" />
        </div>
        <button onClick={handleSendRequest} style={{ background: '#6366f1' }}>Send Request</button>
      </div>

      {/* Incoming Requests */}
      <h2>📥 Requests Waiting for You</h2>
      {incoming.length === 0 ? <p>No pending requests.</p> : (
        <div className="txn-list">
          {incoming.map(r => (
            <div key={r._id} className="txn-item" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="txn-details">
                <p className="txn-type">{r.requester.name} is requesting ₹{r.amount}</p>
                <p className="txn-date">{r.note}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleAction(r._id, 'pay')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer' }}>Pay</button>
                <button onClick={() => handleAction(r._id, 'reject')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
