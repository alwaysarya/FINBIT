import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, Hash, Plus, ArrowUpRight, Clock, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [newAccountType, setNewAccountType] = useState('current');
  const [showOpenAccount, setShowOpenAccount] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/account/transactions').then(res => {
        let creditTotal = 0, debitTotal = 0;
        res.data.forEach(txn => {
          if (txn.type === 'credit' || (txn.toAccount && txn.toAccount._id === user.account?._id)) creditTotal += txn.amount;
          else debitTotal += txn.amount;
        });
        setChartData([{ name: 'Income', Amount: creditTotal }, { name: 'Expense', Amount: debitTotal }]);
      }).catch(err => console.log(err));
    }
  }, [user]);

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="page">
      <h1>Good morning, {user.name.split(' ')[0]}</h1>
      
      <div className="card-grid">
        <motion.div whileHover={{ scale: 1.01 }}><Card title={<><Wallet size={16}/> Total Balance</>} value={`₹ ${user.account?.balance?.toLocaleString()}`} subtitle={`${user.account?.accountType} account`} /></motion.div>
        <motion.div whileHover={{ scale: 1.01 }}><Card title={<><Hash size={16}/> Account Number</>} value={user.account?.accountNumber} subtitle="Primary A/C" /></motion.div>
      </div>

      <div className="quick-actions">
        <button onClick={() => navigate('/deposit')}><Plus size={18} /> Add Money</button>
        <button onClick={() => navigate('/transfer')}><ArrowUpRight size={18} /> Send Money</button>
        <button onClick={() => navigate('/transactions')}><Clock size={18} /> View History</button>
        <button onClick={() => setShowOpenAccount(!showOpenAccount)}><PlusCircle size={18} /> Open Account</button>
      </div>

      {showOpenAccount && (
        <motion.div className="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '2rem', maxWidth: '400px' }}>
          <h3>Open New Account</h3>
          <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)} style={{ marginBottom: '1rem' }}>
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
          <button onClick={async () => {
             const res = await api.post('/account/open', { accountType: newAccountType });
             alert(`New account created! A/C: ${res.data.account.accountNumber}`);
             window.location.reload();
          }} style={{ width: '100%' }}>Create Account</button>
        </motion.div>
      )}

      <div className="chart-container">
        <h3>Cash Flow</h3>
        <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip cursor={{ fill: '#2A2A2A' }} contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: '8px', color: '#FFF' }} />
              <Legend />
              <Bar dataKey="Amount" radius={[6, 6, 0, 0]} fill="var(--accent-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
