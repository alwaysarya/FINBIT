import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck, Zap, CreditCard, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      
      {/* Navbar for Landing Page */}
      <nav className="navbar" style={{ background: 'transparent', borderBottom: 'none', position: 'absolute', width: '100%', top: 0, padding: '2rem' }}>
        <Link to="/" className="logo" style={{ fontSize: '1.5rem' }}>
          <Landmark size={28} color="var(--accent-primary)" /> FINBIT
        </Link>
        <div>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1.5rem', fontWeight: 500 }}>Log in</Link>
          <Link to="/register" style={{ background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 500 }}>Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 2rem 4rem', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-block', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)', color: '#818CF8', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem' }}>
            🎉 Introducing FINBIT 2.0
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem', color: 'white' }}>
            Banking for the <br />
            <span style={{ background: 'linear-gradient(to right, #4F46E5, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Age.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Experience the future of finance. Send money, pay bills, manage cards, and track your wealth with an interface designed to be simple and powerful.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" style={{ background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: '5rem', position: 'relative' }}
        >
          <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '900px', margin: '0 auto', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '30px', background: 'var(--bg-elevated)', borderRadius: '8px' }}></div>
              <div style={{ width: '150px', height: '30px', background: 'var(--bg-elevated)', borderRadius: '8px' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Balance</p>
                <h2 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>₹ 1,45,000</h2>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly Savings</p>
                <h2 style={{ fontSize: '2.5rem', color: '#10B981', marginTop: '0.5rem' }}>+ ₹ 25,000</h2>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'white' }}>Everything you need to manage money.</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <FeatureCard icon={<Zap size={24} color="#818CF8" />} title="Instant Transfers" desc="Send money instantly via UPI, NEFT, or IMPS with zero hidden fees." />
          <FeatureCard icon={<ShieldCheck size={24} color="#34D399" />} title="Bank-Grade Security" desc="Your data is protected with 256-bit encryption and real-time fraud monitoring." />
          <FeatureCard icon={<CreditCard size={24} color="#F472B6" />} title="Virtual Cards" desc="Create and freeze virtual debit cards instantly for secure online payments." />
          <FeatureCard icon={<TrendingUp size={24} color="#FBBF24" />} title="Smart Analytics" desc="Track your spending, create budgets, and grow your savings with intelligent insights." />
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '3rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2026 FINBIT. Built for the future of finance.</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
      {icon}
    </div>
    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.8rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
  </motion.div>
);

export default Landing;
