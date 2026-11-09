import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, Ticket, CheckCircle2 } from 'lucide-react';

const Support = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', description: '', category: 'transaction' });
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchTickets = () => api.get('/support').then(res => setTickets(res.data)).catch(err => console.log(err));
  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await api.post('/support', form);
      setMsg('Support ticket raised! Our team will contact you.');
      setForm({ subject: '', description: '', category: 'transaction' });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise ticket');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'open') return '#F59E0B';
    if (status === 'in-progress') return '#6366F1';
    if (status === 'resolved') return '#10B981';
    return '#888';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Headphones size={32} color="#DBA030" /> Help & Support
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Raise a complaint or query, and we'll get back to you.</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Raise a Complaint / Ticket</h3>
            
            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Category</label>
            <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem', cursor: 'pointer' }}
            >
              <option value="transaction">Transaction Issue</option>
              <option value="card">Card Issue</option>
              <option value="account">Account Issue</option>
              <option value="other">Other</option>
            </select>

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Subject</label>
            <input 
              type="text"
              value={form.subject} 
              onChange={(e) => setForm({ ...form, subject: e.target.value })} 
              placeholder="e.g. Money not received"
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem' }} 
            />

            <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Description</label>
            <textarea 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              placeholder="Explain your issue in detail..."
              rows="4"
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', fontFamily: 'inherit', resize: 'vertical' }} 
            />

            <button type="submit" style={{ width: '100%', background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              Submit Ticket
            </button>
          </form>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={24} color="#DBA030" /> My Tickets
          </h2>
          {tickets.length === 0 ? (
            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No tickets raised yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map(t => (
                <div key={t._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', borderLeft: `4px solid ${getStatusColor(t.status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1A1A1A' }}>{t.subject}</p>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t.description}</p>
                      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.8rem' }}>{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <span style={{ background: getStatusColor(t.status) + '20', color: getStatusColor(t.status), padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {t.status}
                    </span>
                  </div>
                  {t.adminReply && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#FCF9F2', borderRadius: '12px', borderLeft: '3px solid #DBA030' }}>
                      <p style={{ fontSize: '0.8rem', color: '#DBA030', fontWeight: 700, marginBottom: '0.3rem' }}>Admin Reply</p>
                      <p style={{ fontSize: '0.9rem', color: '#333' }}>{t.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
