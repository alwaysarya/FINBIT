import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Goals = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', targetAmount: '', icon: '🎯' });
  const [addAmount, setAddAmount] = useState({ id: '', amount: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchGoals = () => {
    api.get('/goal').then(res => setGoals(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goal', form);
      setToast({ message: 'Goal created!', type: 'success' });
      setForm({ name: '', targetAmount: '', icon: '🎯' });
      fetchGoals();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create goal', type: 'error' });
    }
  };

  const handleAddMoney = async (e, goalId) => {
    e.preventDefault();
    try {
      const res = await api.put(`/goal/${goalId}/add`, { amount: Number(addAmount.amount) });
      updateBalance(res.data.newBalance);
      setToast({ message: res.data.message, type: 'success' });
      setAddAmount({ id: '', amount: '' });
      fetchGoals();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add money', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>🎯 Savings Goals</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Available Balance: ₹ {user?.account?.balance?.toLocaleString()}</p>

      {/* Naya Goal Form */}
      <div className="form" style={{ marginBottom: '3rem' }}>
        <h3>Create New Goal</h3>
        <div className="input-group">
          <label>Goal Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Naya iPhone" required />
        </div>
        <div className="input-group">
          <label>Target Amount (₹)</label>
          <input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="e.g. 80000" required />
        </div>
        <div className="input-group">
          <label>Choose Icon</label>
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            <option value="🎯">🎯 General</option>
            <option value="📱">📱 Gadget</option>
            <option value="🏍️">🏍️ Bike</option>
            <option value="✈️">✈️ Travel</option>
            <option value="🏠">🏠 House</option>
            <option value="🎓">🎓 Education</option>
          </select>
        </div>
        <button onClick={handleCreate} style={{ background: '#6366f1' }}>Create Goal</button>
      </div>

      {/* Goals List */}
      <div className="card-grid">
        {goals.map(g => {
          const progress = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
          return (
            <div key={g._id} className="card" style={{ borderTop: '4px solid #6366f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{g.icon} {g.name}</h2>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{progress.toFixed(0)}%</span>
              </div>
              
              <div style={{ margin: '1rem 0' }}>
                <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#10b981', transition: 'width 0.3s' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                  <span>Saved: ₹{g.savedAmount.toLocaleString()}</span>
                  <span>Target: ₹{g.targetAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Add Money Form */}
              {addAmount.id === g._id ? (
                <form onSubmit={(e) => handleAddMoney(e, g._id)} style={{ display: 'flex', gap: '5px' }}>
                  <input type="number" placeholder="Amount" value={addAmount.amount} onChange={(e) => setAddAmount({ ...addAmount, amount: e.target.value })} required style={{ flex: 1 }} />
                  <button type="submit" style={{ padding: '0.5rem 1rem' }}>Save</button>
                  <button type="button" onClick={() => setAddAmount({ id: '', amount: '' })} style={{ background: '#ef4444', padding: '0.5rem 1rem' }}>X</button>
                </form>
              ) : (
                <button onClick={() => setAddAmount({ id: g._id, amount: '' })} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155' }}>
                  + Add Money to Goal
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
