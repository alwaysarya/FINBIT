import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const Beneficiaries = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: '', accountNumber: '', nickname: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchList = () => {
    api.get('/beneficiary').then(res => setList(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchList(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/beneficiary', form);
      setToast({ message: 'Beneficiary added!', type: 'success' });
      setForm({ name: '', accountNumber: '', nickname: '' });
      fetchList();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/beneficiary/${id}`);
      setToast({ message: 'Removed successfully', type: 'success' });
      fetchList();
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>👥 Manage Beneficiaries</h1>

      <div className="form" style={{ marginBottom: '2rem' }}>
        <h3>Add New Beneficiary</h3>
        <div className="input-group">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" required />
        </div>
        <div className="input-group">
          <label>Account Number (10 digits)</label>
          <input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="e.g. 7059702760" required />
        </div>
        <div className="input-group">
          <label>Nickname (optional)</label>
          <input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="e.g. Bhai / Dost" />
        </div>
        <button onClick={handleAdd} style={{ background: '#6366f1' }}>Save Beneficiary</button>
      </div>

      <h2>My Saved Beneficiaries</h2>
      {list.length === 0 ? <p>No beneficiaries added yet.</p> : (
        <div className="txn-list">
          {list.map(b => (
            <div key={b._id} className="txn-item">
              <div className="txn-icon">👤</div>
              <div className="txn-details">
                <p className="txn-type">{b.name} {b.nickname && <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>({b.nickname})</span>}</p>
                <p className="txn-date">A/C: {b.accountNumber}</p>
              </div>
              <button onClick={() => handleDelete(b._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>❌</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
