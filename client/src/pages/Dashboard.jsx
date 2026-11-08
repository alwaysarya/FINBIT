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

  // Chart ka data nikalne ke liye
  useEffect(() => {
    if (user) {
      api.get('/account/transactions').then(res => {
        let creditTotal = 0;
        let debitTotal = 0;
        res.data.forEach(txn => {
          // Agar paisa aaya (credit) toh creditTotal me jodo, warna debitTotal me
          if (txn.type === 'credit' || (txn.toAccount && txn.toAccount._id === user.account?._id)) {
            creditTotal += txn.amount;
          } else {
            debitTotal += txn.amount;
          }
        });
        setChartData([
          { name: 'Income', Amount: creditTotal, fill: '#10b981' },
          { name: 'Expense', Amount: debitTotal, fill: '#ef4444' }
        ]);
      }).catch(err => console.log(err));
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page">
      <h1>Welcome, {user.name} 👋</h1>
      
      <div className="card-grid">
        <Card title="Account Balance" value={`₹ ${user.account?.balance?.toLocaleString()}`} subtitle="Available balance" color="#10b981" />
        <Card title="Account Number" value={user.account?.accountNumber} subtitle={user.account?.accountType || 'savings'} color="#4f46e5" />
      </div>

      <div className="quick-actions">
        <button onClick={() => navigate('/deposit')}>💰 Add Money</button>
        <button onClick={() => navigate('/transfer')}>💸 Transfer Money</button>
        <button onClick={() => navigate('/transactions')}>📜 View History</button>
      </div>

      {/* NAYA: Chart Section */}
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
