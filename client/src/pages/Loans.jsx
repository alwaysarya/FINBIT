import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Loans = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ loanType: 'personal', amount: '', tenureMonths: 12 });
  const [emiData, setEmiData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchLoans = () => {
    api.get('/loan').then(res => setLoans(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchLoans(); }, []);

  // EMI calculate karo live
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
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🏦 Loans & EMI</h1>

      <div className="form" style={{ marginBottom: '3rem' }}>
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

        <button type="button" onClick={handleCalculate} style={{ background: '#1e293b', border: '1px solid #334155', marginBottom: '1rem' }}>Calculate EMI</button>

        {emiData && (
          <div className="card" style={{ background: '#0f172a', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Your Monthly EMI</p>
            <h2 style={{ color: '#10b981', fontSize: '2rem' }}>₹{emiData.emi}</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Payable: ₹{emiData.totalPayable} at {emiData.interestRate}% p.a.</p>
          </div>
        )}

        <button onClick={handleApply} style={{ background: '#6366f1' }}>Apply & Get Money</button>
      </div>

      <h2>My Active Loans</h2>
      {loans.length === 0 ? <p>No loans taken yet.</p> : (
        <div className="txn-list">
          {loans.map(l => (
            <div key={l._id} className="txn-item" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="txn-details">
                <p className="txn-type" style={{ textTransform: 'capitalize' }}>{l.loanType} Loan</p>
                <p className="txn-date">EMI: ₹{l.emi}/month • {l.tenureMonths} Months</p>
                <p className="txn-desc">Amount: ₹{l.amount} • Rate: {l.interestRate}%</p>
              </div>
              <div className="txn-amount text-green">
                ₹{l.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Loans;
