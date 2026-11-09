import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';
import { Send, User, Smartphone, Landmark, FileText, ArrowRight } from 'lucide-react';

const Transfer = () => {
  const navigate = useNavigate();
  const { updateBalance } = useContext(AuthContext);
  const [form, setForm] = useState({ toAccountNumber: '', amount: '', description: '', mode: 'UPI' });
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [contacts, setContacts] = useState([]);
  const [step, setStep] = useState(1); // 1: Select, 2: Amount

  useEffect(() => {
    api.get('/account/contacts').then(res => setContacts(res.data)).catch(err => console.log(err));
  }, []);

  const handleContactClick = (accountNumber) => {
    setForm({ ...form, toAccountNumber: accountNumber });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'success' });
    try {
      const res = await api.post('/transaction/transfer', form);
      updateBalance(res.data.newBalance);
      setToast({ message: `Transfer successful via ${form.mode}! New balance: ₹${res.data.newBalance}`, type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Transfer failed', type: 'error' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem', position: 'relative' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Send Money</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>Transfer funds instantly and securely.</p>
        </div>

        {step === 1 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Select Transfer Mode</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { mode: 'UPI', icon: Smartphone, label: 'UPI' },
                  { mode: 'NEFT', icon: Landmark, label: 'NEFT' },
                  { mode: 'IMPS', icon: Send, label: 'IMPS' },
                  { mode: 'Internal', icon: FileText, label: 'Internal' },
                ].map((item) => (
                  <div 
                    key={item.mode} 
                    onClick={() => setForm({ ...form, mode: item.mode })}
                    style={{ 
                      padding: '1.5rem 1rem', 
                      borderRadius: '16px', 
                      border: form.mode === item.mode ? '2px solid #DBA030' : '1px solid rgba(0,0,0,0.1)',
                      background: form.mode === item.mode ? '#FCF9F2' : '#FFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                      <item.icon size={24} color={form.mode === item.mode ? '#DBA030' : '#888'} />
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: form.mode === item.mode ? '#1A1A1A' : '#666' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Contacts</h3>
              {contacts.length === 0 ? (
                <p style={{ color: '#888' }}>No recent contacts. Enter account number manually.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {contacts.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleContactClick(c.accountNumber)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', borderRadius: '16px', background: '#FCF9F2', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBA030', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                        {c.name.charAt(0)}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>{c.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setStep(2)} style={{ width: '100%', background: '#1A1A1A', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                Enter Account Manually <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem' }}>
              &larr; Back
            </button>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div>
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Receiver Account Number</label>
                <div style={{ position: 'relative' }}>
                  <User size={20} color="#999" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. 7059702760" 
                    value={form.toAccountNumber} 
                    onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })} 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: 700, color: '#DBA030' }}>₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount} 
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.5rem', fontWeight: 700, outline: 'none' }}
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rent, Dinner, etc." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
                />
              </div>

              <button type="submit" style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
                Send via {form.mode} <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Transfer;
