import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';
import { Send, User } from 'lucide-react';

const Transfer = () => {
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '', mode: 'UPI' });
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [contacts, setContacts] = useState([]);
  const { updateBalance } = useContext(AuthContext);

  useEffect(() => {
    api.get('/account/contacts').then(res => setContacts(res.data)).catch(err => console.log(err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleContactClick = (accountNumber) => setForm({ ...form, toAccountNumber: accountNumber });

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
    <motion.div className="page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Send size={28} /> Send Money</h1>

      {contacts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 style={{ marginBottom: '1rem' }}>Recent Contacts</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {contacts.map((c, i) => (
              <motion.button 
                key={i} type="button" onClick={() => handleContactClick(c.accountNumber)} 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={16} /> {c.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.form onSubmit={handleSubmit} className="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="input-group">
          <label>Transfer Mode</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['UPI', 'NEFT', 'IMPS', 'Internal'].map(m => (
              <button
                key={m} type="button" onClick={() => setForm({ ...form, mode: m })}
                style={{
                  flex: 1, padding: '0.7rem', borderRadius: '8px',
                  background: form.mode === m ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: 'white', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 600,
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
        
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ marginTop: '1rem' }}>
          <Send size={18} /> Send via {form.mode}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Transfer;
