import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Landmark, User, Mail, Lock, Phone, Gift } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', referralCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' };
  const labelStyle = { fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{ background: '#FFF', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: '#FCF9F2', borderRadius: '50%', marginBottom: '1rem' }}>
            <Landmark size={32} color="#DBA030" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Create Account</h1>
          <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Join FINBIT and start banking today</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input name="name" type="text" placeholder="Enter your full name" onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Phone Number (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input name="phone" type="tel" placeholder="Enter phone number" onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Referral Code (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Gift size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#DBA030' }} />
              <input name="referralCode" type="text" placeholder="Enter referral code (Get ₹100 bonus)" onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#DBA030', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
