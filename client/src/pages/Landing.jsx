import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck, CreditCard, TrendingUp, Zap, CheckCircle2, DollarSign, Euro } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', color: '#1A1A1A', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Premium Grid Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0, maskImage: 'linear-gradient(to bottom, black, transparent)' }}></div>
      
      {/* Top Glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1200px', height: '800px', background: 'radial-gradient(ellipse, rgba(242, 200, 121, 0.2) 0%, transparent 60%)', zIndex: 0 }}></div>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(252, 249, 242, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px', color: '#000' }}>
          <Landmark size={28} color="#DBA030" /> FINBIT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/login" style={{ color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Log in</Link>
          
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '12rem', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFF', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <span style={{ display: 'flex', width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span> Trusted by 100,000+ users
          </div>

          <h1 style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1, marginBottom: '1.5rem', color: '#000' }}>
            The future of <br />
            <span style={{ background: 'linear-gradient(135deg, #DBA030 0%, #F2C879 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>banking is here.</span>
          </h1>
          
          <p style={{ fontSize: '1.3rem', color: '#555', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Experience seamless money transfers, smart budgeting, and next-gen security. All in one elegantly designed platform.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" style={{ background: '#1A1A1A', color: '#FFF', textDecoration: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 600, fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}>
              Open Account <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* 3D ISOMETRIC DASHBOARD MOCKUP WITH NEW VISUALS */}
        <div style={{ position: 'relative', marginTop: '6rem', perspective: '2000px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
          
          {/* NEW VISUAL 1: Payment Received */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "10%", right: "15%", width: "240px", background: "#FFF", padding: "1.2rem", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
               <div style={{ background: "#ECFDF5", padding: "8px", borderRadius: "50%", color: "#10B981" }}><CheckCircle2 size={16}/></div>
               <div><p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#000" }}>Payment Received</p><p style={{ fontSize: "0.75rem", color: "#666" }}>From Rahul Sharma</p></div>
            </div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10B981" }}>+ ₹ 25,000</h3>
          </motion.div>

          {/* NEW VISUAL 2: Credit Score */}
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: "absolute", bottom: "15%", left: "12%", width: "200px", background: "#FFF", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)", zIndex: 10 }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666", marginBottom: "1rem" }}>Credit Score</p>
            <div style={{ position: "relative", width: "100%", height: "90px", overflow: "hidden" }}>
               <div style={{ position: "absolute", width: "180px", height: "180px", border: "15px solid #F0F0F0", borderRadius: "50%", top: "0", left: "50%", transform: "translateX(-50%)" }}></div>
               <div style={{ position: "absolute", width: "180px", height: "180px", border: "15px solid #10B981", borderRadius: "50%", top: "0", left: "50%", transform: "translateX(-50%) rotate(45deg)", borderBottomColor: "transparent", borderLeftColor: "transparent" }}></div>
               <div style={{ position: "absolute", bottom: "0", width: "100%", textAlign: "center" }}>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: "#000" }}>785</p>
                  <p style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 700 }}>EXCELLENT</p>
               </div>
            </div>
          </motion.div>

          {/* NEW VISUAL 3: Trending Coin */}
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ position: "absolute", top: "55%", right: "8%", width: "70px", height: "70px", background: "#1A1A1A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", zIndex: 10 }}>
             <TrendingUp size={32} />
          </motion.div>

          {/* MAIN DASHBOARD MOCKUP */}
          <motion.div 
            initial={{ opacity: 0, rotateX: 45, y: 100 }} 
            animate={{ opacity: 1, rotateX: 25, y: 0 }} 
            transition={{ duration: 1.2, type: 'spring' }}
            whileHover={{ rotateX: 10, scale: 1.02 }}
            style={{ width: '900px', height: '500px', background: '#FFF', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)', display: 'flex', overflow: 'hidden', position: 'relative' }}
          >
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#FCF9F2', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800, color: '#000', marginBottom: '1rem' }}>
                <Landmark size={24} color="#DBA030" /> FINBIT
              </div>
              <div style={{ height: '40px', background: '#FFF', borderRadius: '8px', border: '1px solid #EAEAEA' }}></div>
              <div style={{ height: '40px', background: '#FFF', borderRadius: '8px', border: '1px solid #EAEAEA' }}></div>
              <div style={{ height: '40px', background: '#FFF', borderRadius: '8px', border: '1px solid #EAEAEA' }}></div>
            </div>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h2>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F2C879' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: '#FCF9F2', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Balance</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>₹ 2,45,000</h3>
                </div>
                <div style={{ background: '#FCF9F2', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Income</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.5rem' }}>+ ₹ 45,000</h3>
                </div>
              </div>
              <div style={{ height: '150px', background: '#FCF9F2', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', padding: '1rem', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                {[40, 70, 50, 90, 60, 100].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ flex: 1, background: '#F2C879', borderRadius: '4px' }}></motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Other Floating Elements */}
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '-5%', left: '15%', width: '120px', height: '120px', borderRadius: '24px', background: 'linear-gradient(135deg, #F9D989 0%, #E2B657 100%)', boxShadow: '0 30px 60px rgba(219, 160, 48, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#332A1D' }}>
            <CreditCard size={48} />
          </motion.div>
          
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: 'absolute', top: '20%', right: '30%', width: '80px', height: '80px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)' }}>
            <DollarSign size={36} />
          </motion.div>

          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', right: '20%', width: '70px', height: '70px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}>
            <Euro size={32} />
          </motion.div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem', color: '#000' }}>Built for scale.</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Enterprise-grade features, consumer-grade design.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#FCF9F2', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Zap size={28} color="#DBA030" />
            </div>
            <h3 style={{ color: '#000', fontSize: '1.4rem', marginBottom: '0.8rem', fontWeight: 700 }}>Instant Settlements</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Experience zero-latency money transfers with our next-gen payment rails.</p>
          </div>

          <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#FCF9F2', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={28} color="#10B981" />
            </div>
            <h3 style={{ color: '#000', fontSize: '1.4rem', marginBottom: '0.8rem', fontWeight: 700 }}>Zero-Trust Security</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Your funds are secured by military-grade encryption and real-time anomaly detection.</p>
          </div>

          <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#FCF9F2', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <TrendingUp size={28} color="#6366F1" />
            </div>
            <h3 style={{ color: '#000', fontSize: '1.4rem', marginBottom: '0.8rem', fontWeight: 700 }}>Wealth Analytics</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Understand your spending habits and grow your wealth with AI-driven insights.</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.05)', padding: '2rem 4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888', fontSize: '0.9rem', background: '#FCF9F2', position: 'relative', zIndex: 1 }}>
        <div>© 2026 FINBIT. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Landing;
