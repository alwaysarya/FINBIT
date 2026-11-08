import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Transfer = () => {
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '', mode: 'UPI' }); // NAYA: mode
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [contacts, setContacts] = useState([]);
  const { updateBalance } = useContext(AuthContext);

  useEffect(() => {
    api.get('/account/contacts').then(res => setContacts(res.data)).catch(err => console.log(err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactClick = (accountNumber) => {
    setForm({ ...form, toAccountNumber: accountNumber });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'success' });
    try {
      const res = await api.post('/transaction/transfer', form);
      updateBalance(res.data.newBalance);
      setToast({ message: `Transfer successful via ${form.mode}! New balance: ₹${res.data.newBalance}`, type: 'success' });
      setForm({ ...form, toAccountNumber: '', amount: '', description: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Transfer failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💸 Transfer Money</h1>

      {contacts.length > 0 && (
        <div className="recent-contacts">
          <h3>Recent Contacts</h3>
          <div className="contact-chips">
            {contacts.map((c, i) => (
              <button key={i} type="button" onClick={() => handleContactClick(c.accountNumber)} className="contact-chip">
                👤 {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {/* NAYA: Transfer Mode Select */}
        <div className="input-group">
          <label>Transfer Mode</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['UPI', 'NEFT', 'IMPS', 'Internal'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setForm({ ...form, mode: m })}
                style={{
                  flex: 1, padding: '0.6rem', borderRadius: '6px',
                  background: form.mode === m ? '#6366f1' : '#1e293b',
                  color: 'white', border: '1px solid #334155', cursor: 'pointer', fontWeight: 600,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <input name="toAccountNumber" placeholder="Receiver Account Number" value={form.toAccountNumber} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
        <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} />
        
        <button type="submit">Send via {form.mode}</button>
      </form>
    </div>
  );
};

export default Transfer;
