import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const FixedDeposit = () => {
  const [form, setForm] = useState({ amount: '', durationMonths: '12' });
  const [fds, setFds] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { user, updateBalance } = useContext(AuthContext);

  const fetchFDs = () => {
    api.get('/fd').then(res => setFds(res.data)).catch(err => console.log(err));
  };

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
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🏦 Fixed Deposit (FD)</h1>
      
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
          <p className="card-title">Current Balance</p>
          <h2 className="card-value">₹ {user?.account?.balance?.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <p className="card-title">Interest Rate</p>
          <h2 className="card-value">6.5% p.a.</h2>
        </div>
      </div>

      <div className="form">
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
        <button onClick={handleCreate} style={{ background: '#10b981' }}>Create FD</button>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>My FDs</h2>
      {fds.length === 0 ? <p>No FDs created yet.</p> : (
        <div className="txn-list">
          {fds.map(fd => (
            <div key={fd._id} className="txn-item" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="txn-details">
                <p className="txn-type">₹ {fd.amount} ({fd.durationMonths} Months)</p>
                <p className="txn-date">Maturity: {new Date(fd.maturityDate).toLocaleDateString()}</p>
                <p className="txn-desc">Status: {fd.status}</p>
              </div>
              <div className="txn-amount text-green">
                ₹{fd.maturityAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixedDeposit;
