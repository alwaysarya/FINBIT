import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, Calculator, CheckCircle2 } from 'lucide-react';

const Loans = () => {
  const navigate = useNavigate();
  const { updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ loanType: 'personal', amount: '', tenureMonths: 12 });
  const [emiData, setEmiData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

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
    setError(''); setMsg('');
    try {
      const res = await api.post('/loan/apply', { ...form, amount: Number(form.amount), tenureMonths: Number(form.tenureMonths) });
      updateBalance(res.data.newBalance);
      setMsg('Loan Approved! Amount credited to your account.');
      setForm({ loanType: 'personal', amount: '', tenureMonths: 12 });
      setEmiData(null);
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || 'Loan application failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Landmark size={32} color="#DBA030" /> Loans & EMI
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Apply for instant loans with flexible tenure options.</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Apply for a Loan</h3>
            
            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Loan Type</label>
            <select 
              value={form.loanType} 
              onChange={(e) => setForm({ ...form, loanType: e.target.value })} 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem', cursor: 'pointer' }}
            >
              <option value="personal">Personal Loan (10.5%)</option>
              <option value="home">Home Loan (8.5%)</option>
              <option value="vehicle">Vehicle Loan (9.2%)</option>
              <option value="education">Education Loan (7.5%)</option>
            </select>

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Loan Amount (₹)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 100000" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem' }} />

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Tenure (Months)</label>
            <input type="number" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem' }} />

            <button onClick={handleCalculate} style={{ width: '100%', background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Calculator size={18} /> Calculate EMI
            </button>

            {emiData && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#FCF9F2', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Your Monthly EMI</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981' }}>₹{emiData.emi}</h2>
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>Total Payable: ₹{emiData.totalPayable} at {emiData.interestRate}% p.a.</p>
              </motion.div>
            )}

            <button onClick={handleApply} style={{ width: '100%', background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> Apply & Get Money
            </button>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>My Active Loans</h2>
          {loans.length === 0 ? (
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No loans taken yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loans.map(l => (
                <div key={l._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', borderLeft: '4px solid #DBA030' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A', textTransform: 'capitalize' }}>{l.loanType} Loan</p>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.3rem' }}>EMI: ₹{l.emi}/month • {l.tenureMonths} Months</p>
                      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>Amount: ₹{l.amount} • Rate: {l.interestRate}%</p>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#10B981' }}>₹{l.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Loans;
