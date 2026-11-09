import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, CheckCircle2, Copy, Zap } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const UpiSetup = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [upiId, setUpiId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/upi').then(res => {
      setUpiId(res.data.upiId);
      setLoading(false);
    }).catch(err => { console.log(err); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await api.post('/upi/generate');
      setUpiId(res.data.upiId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create UPI ID');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>UPI Setup</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Create your unique UPI ID to send and receive money instantly.</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#FFF', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <div style={{ background: '#FCF9F2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Smartphone size={40} color="#DBA030" />
          </div>

          {upiId ? (
            <>
              <CheckCircle2 size={40} color="#10B981" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>Your UPI ID is Ready!</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Share this ID to receive money instantly.</p>
              
              <div style={{ background: '#FCF9F2', border: '2px dashed #DBA030', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Your UPI ID</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A1A', fontFamily: 'monospace', marginBottom: '1rem' }}>{upiId}</p>
                <button onClick={copyToClipboard} style={{ background: copied ? '#10B981' : '#1A1A1A', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  {copied ? '✓ Copied!' : 'Copy UPI ID'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => navigate('/transfer')} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 600, flex: 1, cursor: 'pointer' }}>Send Money</button>
                <button onClick={() => navigate('/dashboard')} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 600, flex: 1, cursor: 'pointer' }}>Go Home</button>
              </div>
            </>
          ) : (
            <>
              <Zap size={40} color="#DBA030" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>Create Your UPI ID</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Instant money transfers. Zero fees. Available 24/7.</p>
              
              <button 
                onClick={handleCreate} 
                disabled={creating}
                style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', width: '100%' }}
              >
                {creating ? 'Creating...' : 'Create UPI ID'}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UpiSetup;
