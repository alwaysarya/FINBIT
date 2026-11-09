import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Landmark, Mail, Lock, CreditCard, QrCode, ShieldCheck, TrendingUp, IndianRupee, DollarSign, Euro, PoundSterling, Bitcoin } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bank-auth-wrapper">
      
      {/* BACKGROUND DOTS */}
      <div style={{ position: 'absolute', left: '5%', bottom: '10%', width: '150px', height: '200px', backgroundImage: 'radial-gradient(#F2C879 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', right: '5%', bottom: '10%', width: '150px', height: '200px', backgroundImage: 'radial-gradient(#F2C879 2px, transparent 2px)', backgroundSize: '20px 20px', opacity: 0.6 }}></div>

      {/* ========================================= */}
      {/* BACKGROUND ELEMENTS (Perfectly Positioned) */}
      {/* ========================================= */}
      
      {/* 1. Gold Credit Card - Top Left */}
      <motion.div 
        className="bank-bg-visual"
        style={{ top: '15%', left: '6%', width: '340px', height: '210px', background: 'linear-gradient(135deg, #F9D989 0%, #E2B657 100%)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 0.5)', transform: 'rotate(-12deg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem', color: '#332A1D', zIndex: 2 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '1.2rem' }}>FINBIT</span>
          <CreditCard size={32} />
        </div>
        <div style={{ letterSpacing: '3px', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace' }}>**** **** **** 4589</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          <span>ARYAN THAKUR</span>
          <span>12/28</span>
        </div>
      </motion.div>

      {/* 2. Savings Graph Card - Top Left-Mid */}
      <motion.div 
        className="bank-bg-visual"
        style={{ top: '12%', left: '35%', background: '#FFF', padding: '1rem 1.5rem', borderRadius: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 3 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div style={{ background: '#ECFDF5', color: '#10B981', padding: '10px', borderRadius: '14px' }}><TrendingUp size={28} /></div>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600, letterSpacing: '1px' }}>SAVINGS</p>
          <p style={{ fontSize: '1.2rem', color: '#000', fontWeight: 800 }}>+12.5%</p>
        </div>
      </motion.div>

      {/* 3. UPI QR Card - Right Mid (Same position as before) */}
      <motion.div 
        className="bank-bg-visual"
        style={{ right: '15%', top: '35%', width: '200px', height: '220px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '32px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)', transform: 'rotate(10deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', zIndex: 2 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <QrCode size={90} color="#1A1A1A" strokeWidth={1.5} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', letterSpacing: '1px' }}>SCAN TO PAY</span>
      </motion.div>

      {/* 4. 3D Smart Vault - Bottom Right (Below QR) */}
      <motion.div 
        style={{ position: 'absolute', right: '20%', bottom: '10%', width: '220px', zIndex: 2, pointerEvents: 'none' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="150" cy="270" rx="100" ry="20" fill="#000" fillOpacity="0.1"/>
          <rect x="50" y="50" width="200" height="200" rx="20" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4"/>
          <rect x="70" y="70" width="160" height="160" rx="10" fill="#F8F5EE" stroke="#1A1A1A" strokeWidth="3"/>
          <circle cx="150" cy="150" r="45" fill="#FFF" stroke="#1A1A1A" strokeWidth="4"/>
          <circle cx="150" cy="150" r="30" fill="#F2C879" stroke="#1A1A1A" strokeWidth="3"/>
          <circle cx="150" cy="150" r="10" fill="#1A1A1A"/>
          <line x1="150" y1="105" x2="150" y2="115" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="150" y1="185" x2="150" y2="195" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="105" y1="150" x2="115" y2="150" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="185" y1="150" x2="195" y2="150" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round"/>
          <rect x="70" y="250" width="20" height="20" fill="#1A1A1A" rx="4"/>
          <rect x="210" y="250" width="20" height="20" fill="#1A1A1A" rx="4"/>
        </svg>
      </motion.div>

      {/* 5. Dollar Coin - Top Right */}
      <motion.div 
        className="bank-bg-visual"
        style={{ top: '10%', right: '25%', background: '#10B981', color: 'white', width: '80px', height: '80px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DollarSign size={36} strokeWidth={2.5} />
      </motion.div>

      {/* 6. Rupee Coin - Mid Right */}
      <motion.div 
        className="bank-bg-visual"
        style={{ top: '20%', right: '18%', background: 'linear-gradient(135deg, #F9D989 0%, #DBA030 100%)', color: '#5A4315', width: '80px', height: '80px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(219, 160, 48, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <IndianRupee size={36} strokeWidth={2.5} />
      </motion.div>

      {/* 7. Euro Coin - Mid Left */}
      <motion.div 
        className="bank-bg-visual"
        style={{ top: '40%', left: '8%', background: '#6366F1', color: 'white', width: '70px', height: '70px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Euro size={32} strokeWidth={2.5} />
      </motion.div>

      {/* 8. Bitcoin Coin - Bottom Left */}
      <motion.div 
        className="bank-bg-visual"
        style={{ bottom: '25%', left: '12%', background: '#F59E0B', color: 'white', width: '70px', height: '70px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Bitcoin size={32} strokeWidth={2.5} />
      </motion.div>

      {/* 9. Pound Coin - Bottom Right Corner */}
      <motion.div 
        className="bank-bg-visual"
        style={{ bottom: '20%', right: '5%', background: '#EC4899', color: 'white', width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(236, 72, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <PoundSterling size={28} strokeWidth={2.5} />
      </motion.div>

      {/* 10. Security Shield - Bottom Left Corner */}
      <motion.div 
        className="bank-bg-visual"
        style={{ bottom: '10%', left: '25%', background: 'linear-gradient(135deg, #6A85FF 0%, #4338CA 100%)', color: 'white', width: '70px', height: '70px', borderRadius: '50%', boxShadow: '0 15px 30px -5px rgba(106, 133, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck size={32} strokeWidth={2.5} />
      </motion.div>

      {/* Header */}
      <div className="bank-header">
        <div className="bank-logo">
          <Landmark size={32} color="#DBA030" /> FINBIT
        </div>
        <div className="bank-header-right">
          <Link to="/register">Sign up</Link>
          <a href="#" style={{ background: '#F9D989', padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: 700 }}>Request Demo</a>
        </div>
      </div>

      {/* Center Login Card */}
      <div className="bank-center">
        <motion.div 
          className="bank-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <h2>Welcome Back</h2>
          <p className="subtitle">Log in to your secure banking dashboard.</p>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', background: '#FEE2E2', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="bank-input-group">
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="bank-input-group">
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</Link>
            </div>

            <button type="submit" className="bank-submit">Sign In</button>
          </form>

          <div style={{ marginTop: '2rem', fontSize: '0.95rem', color: '#666', fontWeight: 500 }}>
            Don't have an account? <Link to="/register" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Sign up</Link>
          </div>
        </motion.div>
      </div>

      <div className="bank-copyright">
        Copyright @finbit 2026 | Privacy Policy
      </div>
    </div>
  );
};

export default Login;
