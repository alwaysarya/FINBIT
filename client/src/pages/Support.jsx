import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const Support = () => {
  const [form, setForm] = useState({ subject: '', description: '', category: 'transaction' });
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchTickets = () => {
    api.get('/support').then(res => setTickets(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', form);
      setToast({ message: 'Support ticket raised! Our team will contact you.', type: 'success' });
      setForm({ subject: '', description: '', category: 'transaction' });
      fetchTickets();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to raise ticket', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    if (status === 'open') return '#f59e0b';
    if (status === 'in-progress') return '#6366f1';
    if (status === 'resolved') return '#10b981';
    return '#94a3b8';
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🎧 Help & Support</h1>

      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Raise a Complaint / Ticket</h3>
        
        <div className="input-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="transaction">Transaction Issue</option>
            <option value="card">Card Issue</option>
            <option value="account">Account Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label>Subject</label>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Money not received" required />
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            placeholder="Explain your issue in detail..."
            rows="4"
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
            required 
          />
        </div>

        <button onClick={handleSubmit} style={{ background: '#6366f1' }}>Submit Ticket</button>
      </div>

      <h2>🎫 My Tickets</h2>
      {tickets.length === 0 ? <p>No tickets raised yet.</p> : (
        <div className="txn-list">
          {tickets.map(t => (
            <div key={t._id} className="txn-item" style={{ borderLeft: `4px solid ${getStatusColor(t.status)}` }}>
              <div className="txn-details">
                <p className="txn-type">{t.subject}</p>
                <p className="txn-desc">{t.description}</p>
                <p className="txn-date">{new Date(t.createdAt).toLocaleString()}</p>
                {t.adminReply && (
                  <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: '#0f172a', borderRadius: '6px' }}>
                    <p style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 'bold' }}>Admin Reply:</p>
                    <p style={{ fontSize: '0.9rem' }}>{t.adminReply}</p>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', background: getStatusColor(t.status), color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Support;
