import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    </div>
  );
};

export default Dashboard;
