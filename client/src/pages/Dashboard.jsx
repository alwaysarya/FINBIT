import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, Plus, Send, ArrowDownLeft, ArrowUpRight, 
  CheckCircle2, Zap, Smartphone, Calendar, CreditCard, Bell, Search,
  LogOut, ShieldCheck, Landmark, PiggyBank, Briefcase, HeartPulse,
  FileText, ChevronRight, Eye, RefreshCw, User, Home, Heart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [chartData, setChartData] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0 });
  const [activeTab, setActiveTab] = useState('Banking');
  const [searchQuery, setSearchQuery] = useState('');

  const pieData = [
    { name: 'Food', value: 4000 },
    { name: 'Shopping', value: 3000 },
    { name: 'Travel', value: 2000 },
    { name: 'Bills', value: 2780 },
  ];
  const COLORS = ['#DBA030', '#10B981', '#6366F1', '#EF4444'];

  useEffect(() => {
    if (user) {
      api.get('/account/transactions').then(res => {
        const txns = res.data;
        setRecentTxns(txns.slice(0, 3));
        let income = 0, expense = 0;
        txns.forEach(txn => {
          if (txn.type === 'credit' || (txn.toAccount && txn.toAccount._id === user.account?._id)) income += txn.amount;
          else expense += txn.amount;
        });
        setStats({ income, expense });
        
        const dailyMap = {};
        txns.forEach(t => {
          const day = new Date(t.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
          dailyMap[day] = (dailyMap[day] || 0) + t.amount;
        });
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const realData = days.map(d => ({ name: d, amount: dailyMap[d] || 0 }));
        setChartData(realData);
      }).catch(err => console.log(err));
    }
  }, [user]);

  if (!user) { navigate('/login'); return null; }

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', paddingBottom: '4rem', position: 'relative' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          {['Banking', 'Lifestyle', 'Rewards'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ paddingBottom: '1rem', cursor: 'pointer', borderBottom: activeTab === tab ? '3px solid #DBA030' : '3px solid transparent', color: activeTab === tab ? '#1A1A1A' : '#888', fontWeight: activeTab === tab ? 700 : 500 }}>
              {tab}
            </div>
          ))}
        </div>

        {/* HERO CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Transaction Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'linear-gradient(135deg, #DBA030 0%, #F2C879 100%)', padding: '2rem', borderRadius: '24px', color: '#FFF', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(219, 160, 48, 0.2)' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', opacity: 0.2, transform: 'rotate(15deg)' }}>
              <CreditCard size={180} color="#FFF" />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>TRANSACTION ACCOUNTS (01)</p>
              <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.9 }}>Combined Balance</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>₹ {user.account?.balance?.toLocaleString()}</h2>
                <RefreshCw size={20} style={{ cursor: 'pointer', opacity: 0.8 }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => navigate('/transactions')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', color: '#FFF', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>View Accounts</button>
                <button onClick={() => navigate('/transactions')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', padding: '0.8rem 1.5rem', borderRadius: '8px', color: '#FFF', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Transactions</button>
              </div>
            </div>
          </motion.div>

          {/* Loan Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: '#1A1A1A', padding: '2rem', borderRadius: '24px', color: '#FFF', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.7 }}>LOANS (00)</p>
              <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.7 }}>Total Outstanding Amount</p>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>₹ 0.00</h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => navigate('/loans')} style={{ background: '#DBA030', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', color: '#1A1A1A', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>View Details</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CREDIT CARD BANNER */}
        <div style={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#FCF9F2', padding: '10px', borderRadius: '50%' }}><Bell size={18} color="#DBA030" /></div>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>You are just a few taps away from your CREDIT CARD. Apply Now!</p>
          </div>
          <ChevronRight size={20} color="#888" />
        </div>

        {/* PAYMENTS & TRANSFERS */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Payments & Transfers</h3>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            {['UPI', 'Fund Transfer', 'Bills', 'Yono Cash'].map((tab, i) => (
               <p key={tab} style={{ paddingBottom: '0.8rem', color: i === 0 ? '#1A1A1A' : '#888', fontWeight: i === 0 ? 700 : 500, borderBottom: i === 0 ? '2px solid #DBA030' : 'none', fontSize: '0.95rem' }}>{tab}</p>
            ))}
          </div>

          <div style={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#FEF2F2', padding: '6px', borderRadius: '50%' }}><div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></div></div>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>You haven't created a UPI ID.</p>
            </div>
            <p style={{ color: '#1A1A1A', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Activate UPI ID</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/transfer')}>
              <div style={{ background: '#FFF', width: '65px', height: '65px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}><Smartphone size={28} color="#DBA030" /></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Pay to mobile or contact</p>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/transfer')}>
              <div style={{ background: '#FFF', width: '65px', height: '65px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}><FileText size={28} color="#DBA030" /></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Pay UPI ID or Number</p>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/transfer')}>
              <div style={{ background: '#FFF', width: '65px', height: '65px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}><Landmark size={28} color="#DBA030" /></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Pay to Bank A/C</p>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/transactions')}>
              <div style={{ background: '#FFF', width: '65px', height: '65px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}><ArrowUpRight size={28} color="#DBA030" /></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>View Transactions</p>
            </div>
          </div>
        </div>

        {/* PERSONAL FINANCE BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #333 100%)', borderRadius: '24px', padding: '3rem', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Personal Finance Manager</h3>
            <p style={{ color: '#A1A1AA', fontSize: '0.95rem' }}>One dashboard, all your finances, start using Personal Finance Manager now!</p>
          </div>
          <button style={{ background: '#DBA030', color: '#1A1A1A', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Start Now</button>
        </div>

        {/* CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Cash Flow Analytics</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#DBA030" stopOpacity={0.3}/><stop offset="95%" stopColor="#DBA030" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="name" stroke="#CCC" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#CCC" tick={{ fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#FFF' }} />
                  <Area type="monotone" dataKey="amount" stroke="#DBA030" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Spending Categories</h3>
            <div style={{ flex: 1, minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#FFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '1rem' }}>
              {pieData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#666' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index] }}></div> {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SERVICES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
           {[
             { icon: PiggyBank, label: 'Deposits', path: '/fd' },
             { icon: Briefcase, label: 'Loans', path: '/loans' },
             { icon: CreditCard, label: 'Cards', path: '/card' },
             { icon: ShieldCheck, label: 'Insurance', path: '/support' },
             { icon: FileText, label: 'Services', path: '/bills' },
             { icon: TrendingUp, label: 'Investments', path: '/rd' },
           ].map((item, i) => (
             <div key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(item.path)}>
               <div style={{ background: '#FFF', width: '65px', height: '65px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                 <item.icon size={28} color="#DBA030" />
               </div>
               <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>{item.label}</p>
             </div>
           ))}
        </div>

        {/* FOOTER NAV */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-around', color: '#888' }}>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: '#DBA030' }}><Home size={20} /><span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Home</span></div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Heart size={20} /><span style={{ fontSize: '0.75rem' }}>Favorites</span></div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><ShieldCheck size={20} /><span style={{ fontSize: '0.75rem' }}>Insurance</span></div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><TrendingUp size={20} /><span style={{ fontSize: '0.75rem' }}>Investments</span></div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;