import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';

const FixedDeposit = () => {
  const [form, setForm] = useState({ amount: '', durationMonths: '12' });
  const [fds, setFds] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { user, updateBalance } = useContext(AuthContext);

  const fetchFDs = () => api.get('/fd').then(res => setFds(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchFDs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/fd/create', { amount: Number(form.amount), durationMonths: Number(form.durationMonths) });
      updateBalance(res.data.newBalance);
      setToast({ message: `FD Created! Maturity: ₹${res.data.fd.maturityAmount}`, type: 'success' });
      setForm({ amount: '', durationMonths: '12' });
      fetchFDs();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'FD Failed', type: 'error' });
    }
  };

  return (
    <motion.div className="page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🏦 Fixed Deposit (FD)</h1>
      
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <motion.div whileHover={{ scale: 1.02 }} className="card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <p className="card-title">Current Balance</p>
          <h2 className="card-value">₹ {user?.account?.balance?.toLocaleString()}</h2>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="card" style={{ borderTop: '4px solid #F5A623' }}>
          <p className="card-title">Interest Rate</p>
          <h2 className="card-value">6.5% p.a.</h2>
        </motion.div>
      </div>

      <motion.div className="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3>Create New FD</h3>
        <div className="input-group">
          <label>Amount (Min ₹1000)</label>
          <input type="number" placeholder="Enter amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Duration</label>
          <select value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}>
            <option value="6">6 Months</option>
            <option value="12">12 Months (1 Year)</option>
            <option value="24">24 Months (2 Years)</option>
            <option value="36">36 Months (3 Years)</option>
          </select>
        </div>
        <motion.button onClick={handleCreate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: 'var(--success)' }}>Create FD</motion.button>
      </motion.div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>My FDs</h2>
      {fds.length === 0 ? <p>No FDs created yet.</p> : (
        <motion.div className="txn-list" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          {fds.map(fd => (
            <motion.div key={fd._id} className="txn-item" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} style={{ borderLeft: '4px solid #F5A623' }}>
              <div className="txn-details">
                <p className="txn-type">₹ {fd.amount} ({fd.durationMonths} Months)</p>
                <p className="txn-date">Maturity: {new Date(fd.maturityDate).toLocaleDateString()}</p>
                <p className="txn-desc">Status: {fd.status}</p>
              </div>
              <div className="txn-amount text-green">₹{fd.maturityAmount}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FixedDeposit;
