import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { updateBalance } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'success' });
    try {
      const res = await api.post('/transaction/deposit', { amount: Number(amount) });
      updateBalance(res.data.newBalance);
      setToast({ message: `₹${amount} deposited successfully! New balance: ₹${res.data.newBalance}`, type: 'success' });
      setAmount('');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Deposit failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💰 Deposit Money</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Add Money</button>
      </form>
    </div>
  );
};

export default Deposit;
