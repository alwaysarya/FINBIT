import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Transfer = () => {
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '' });
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
      setToast({ message: `Transfer successful! New balance: ₹${res.data.newBalance}`, type: 'success' });
      setForm({ toAccountNumber: '', amount: '', description: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Transfer failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💸 Transfer Money</h1>

      {/* NAYA: Recent Contacts UI */}
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
        <input name="toAccountNumber" placeholder="Receiver Account Number (10 digits)" value={form.toAccountNumber} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
        <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} />
        <button type="submit">Send Money</button>
      </form>
    </div>
  );
};

export default Transfer;
