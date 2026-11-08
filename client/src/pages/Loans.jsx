import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';

const Loans = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ loanType: 'personal', amount: '', tenureMonths: 12 });
  const [emiData, setEmiData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchLoans = () => api.get('/loan').then(res => setLoans(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchLoans(); }, []);

  const handleCalculate = async () => {
    if (!form.amount) return;
    try {
      const res = await api.post('/loan/calculate', { amount: Number(form.amount), tenureMonths: Number(form.tenureMonths), loanType: form.loanType });
      setEmiData(res.data);
    } catch (err) { console.log(err); }
  };

  const handleApply = async () => {
    try {
      const res = await api.post('/loan/apply', { ...form, amount: Number(form.amount), tenureMonths: Number(form.tenureMonths) });
      updateBalance(res.data.newBalance);
      setToast({ message: 'Loan Approved! Amount credited.', type: 'success' });
      setForm({ loanType: 'personal', amount: '', tenureMonths: 12 });
      setEmiData(null);
      fetchLoans();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Loan failed', type: 'error' });
    }
  };

  return (
    <motion.div className="page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🏦 Loans & EMI</h1>

      <motion.div className="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: '3rem' }}>
        <h3>Apply for a Loan</h3>
        
        <div className="input-group">
          <label>Loan Type</label>
          <select value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })}>
            <option value="personal">Personal Loan (10.5%)</option>
            <option value="home">Home Loan (8.5%)</option>
            <option value="vehicle">Vehicle Loan (9.2%)</option>
            <option value="education">Education Loan (7.5%)</option>
          </select>
        </div>
        
        <div className="input-group">
          <label>Loan Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 100000" required />
        </div>
        
        <div className="input-group">
          <label>Tenure (Months)</label>
          <input type="number" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} required />
        </div>

        <motion.button type="button" onClick={handleCalculate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>Calculate EMI</motion.button>

        {emiData && (
          <motion.div className="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--glass-bg)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Monthly EMI</p>
            <h2 style={{ color: 'var(--success)', fontSize: '2.5rem' }}>₹{emiData.emi}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Payable: ₹{emiData.totalPayable} at {emiData.interestRate}% p.a.</p>
          </motion.div>
        )}

        <motion.button onClick={handleApply} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: 'var(--accent-primary)' }}>Apply & Get Money</motion.button>
      </motion.div>

      <h2>My Active Loans</h2>
      {loans.length === 0 ? <p>No loans taken yet.</p> : (
        <motion.div className="txn-list" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          {loans.map(l => (
            <motion.div key={l._id} className="txn-item" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} style={{ borderLeft: '4px solid var(--success)' }}>
              <div className="txn-details">
                <p className="txn-type" style={{ textTransform: 'capitalize' }}>{l.loanType} Loan</p>
                <p className="txn-date">EMI: ₹{l.emi}/month • {l.tenureMonths} Months</p>
                <p className="txn-desc">Amount: ₹{l.amount} • Rate: {l.interestRate}%</p>
              </div>
              <div className="txn-amount text-green">₹{l.amount}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Loans;
