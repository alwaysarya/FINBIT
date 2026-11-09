import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Landmark, Mail, Lock, User, Phone, CreditCard, QrCode, ShieldCheck, TrendingUp, IndianRupee, DollarSign, Euro, PoundSterling, Bitcoin } from 'lucide-react';
import { motion } from 'framer-motion';
import BankAnimation from '../components/BankAnimation';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', referralCode: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="bank-auth-wrapper">
      <BankAnimation />
      
      <div style={{ position: 'absolute', left: '5%', bottom: '10%', width: '150px', height: '200px', backgroundImage: 'radial-gradient(#F2C879 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', right: '5%', bottom: '10%', width: '150px', height: '200px', backgroundImage: 'radial-gradient(#F2C879 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.6 }}></div>

      <motion.div className="bank-bg-visual" style={{ top: '15%', left: '6%', width: '300px', height: '180px', background: 'linear-gradient(135deg, #F9D989 0%, #E2B657 100%)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 0.5)', transform: 'rotate(-12deg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', color: '#332A1D', zIndex: 2 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '1.1rem' }}>FINBIT</span><CreditCard size={28} /></div>
        <div style={{ letterSpacing: '2px', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace' }}>**** **** **** 0000</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}><span>JOHN DOE</span><span>12/28</span></div>
      </motion.div>

      <motion.div className="bank-bg-visual" style={{ right: '15%', top: '35%', width: '180px', height: '200px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '32px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)', transform: 'rotate(10deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', zIndex: 2 }} animate={{ y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <QrCode size={70} color="#1A1A1A" strokeWidth={1.5} /><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#666', letterSpacing: '1px' }}>SCAN TO PAY</span>
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '20%', bottom: '10%', width: '180px', zIndex: 2, pointerEvents: 'none' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, type: 'spring' }}>
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="150" cy="270" rx="100" ry="20" fill="#000" fillOpacity="0.1"/><rect x="50" y="50" width="200" height="200" rx="20" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4"/><rect x="70" y="70" width="160" height="160" rx="10" fill="#F8F5EE" stroke="#1A1A1A" strokeWidth="3"/><circle cx="150" cy="150" r="45" fill="#FFF" stroke="#1A1A1A" strokeWidth="4"/><circle cx="150" cy="150" r="30" fill="#F2C879" stroke="#1A1A1A" strokeWidth="3"/><circle cx="150" cy="150" r="10" fill="#1A1A1A"/><rect x="70" y="250" width="20" height="20" fill="#1A1A1A" rx="4"/><rect x="210" y="250" width="20" height="20" fill="#1A1A1A" rx="4"/>
        </svg>
      </motion.div>

      {/* CURRENCY COINS - Now all present */}
      <motion.div className="bank-bg-visual" style={{ top: '10%', right: '25%', background: '#10B981', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}><DollarSign size={28} strokeWidth={2.5} /></motion.div>
      <motion.div className="bank-bg-visual" style={{ top: '20%', right: '18%', background: 'linear-gradient(135deg, #F9D989 0%, #DBA030 100%)', color: '#5A4315', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}><IndianRupee size={28} strokeWidth={2.5} /></motion.div>
      <motion.div className="bank-bg-visual" style={{ top: '40%', left: '8%', background: '#6366F1', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }}><Euro size={28} strokeWidth={2.5} /></motion.div>
      <motion.div className="bank-bg-visual" style={{ bottom: '40%', left: '8%', background: '#F59E0B', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity }}><Bitcoin size={28} strokeWidth={2.5} /></motion.div>
      <motion.div className="bank-bg-visual" style={{ bottom: '20%', right: '5%', background: '#EC4899', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }}><PoundSterling size={28} strokeWidth={2.5} /></motion.div>
      <motion.div className="bank-bg-visual" style={{ bottom: '10%', left: '25%', background: 'linear-gradient(135deg, #6A85FF 0%, #4338CA 100%)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }} animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }}><ShieldCheck size={28} strokeWidth={2.5} /></motion.div>

      <div className="bank-header">
        <div className="bank-logo"><Landmark size={32} color="#DBA030" /> FINBIT</div>
      </div>

      <div className="bank-center">
        <motion.div className="bank-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring' }} style={{ padding: '2.5rem' }}>
          <h2>Create Account</h2>
          <p className="subtitle">Join FINBIT today and experience secure banking.</p>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', background: '#FEE2E2', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="bank-input-group"><User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} /><input type="text" name="name" placeholder="Full Name" onChange={handleChange} required /></div>
            <div className="bank-input-group"><Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} /><input type="email" name="email" placeholder="Email address" onChange={handleChange} required /></div>
            <div className="bank-input-group"><Phone size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} /><input type="text" name="phone" placeholder="Phone (Optional)" onChange={handleChange} /></div>
            <div className="bank-input-group"><Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} /><input type="password" name="password" placeholder="Password (min 6 chars)" onChange={handleChange} required /></div>
            <div className="bank-input-group"><TrendingUp size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} /><input type="text" name="referralCode" placeholder="Referral Code (Optional)" onChange={handleChange} /></div>
            <button type="submit" className="bank-submit" style={{ marginTop: '1rem' }}>Sign Up</button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#666', fontWeight: 500 }}>Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Log in</Link></div>
        </motion.div>
      </div>

      <div className="bank-copyright">Copyright @finbit 2026 | Privacy Policy</div>
    </div>
  );
};

export default Register;
