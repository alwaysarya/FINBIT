import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

  const handleOpenAccount = async () => {
    try {
      const res = await api.post('/account/open', { accountType: newAccountType });
      alert(`New ${newAccountType} account created! A/C: ${res.data.account.accountNumber}`);
      setShowOpenAccount(false);
      window.location.reload(); // Reload to see new account
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to open account');
    }
  };

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="page">
      <h1>Welcome, {user.name} 👋</h1>
      
      <div className="card-grid">
        <Card title="Account Balance" value={`₹ ${user.account?.balance?.toLocaleString()}`} subtitle={`${user.account?.accountType} account`} color="#10b981" />
        <Card title="Account Number" value={user.account?.accountNumber} subtitle="Primary A/C" color="#4f46e5" />
      </div>

      <div className="quick-actions" style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/deposit')}>💰 Add Money</button>
        <button onClick={() => navigate('/transfer')}>💸 Transfer Money</button>
        <button onClick={() => navigate('/transactions')}>📜 View History</button>
        <button onClick={() => setShowOpenAccount(!showOpenAccount)} style={{ background: '#f59e0b' }}>➕ Open New Account</button>
      </div>

      {showOpenAccount && (
        <div className="card" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
          <h3>Open New Account</h3>
          <div className="input-group">
            <label>Account Type</label>
            <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
          </div>
          <button onClick={handleOpenAccount} style={{ width: '100%', background: '#10b981' }}>Create Account</button>
        </div>
      )}

      <div className="chart-container">
        <h3>📊 Income vs Expense</h3>
        <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="Amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
