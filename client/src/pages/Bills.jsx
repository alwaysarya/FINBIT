import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Bills = () => {
  const [billType, setBillType] = useState('Mobile Recharge');
  const [billerName, setBillerName] = useState('');
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { updateBalance } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'success' });
    try {
      const res = await api.post('/transaction/pay-bill', { billType, billerName, amount });
      updateBalance(res.data.newBalance);
      setToast({ message: `Bill paid successfully! New balance: ₹${res.data.newBalance}`, type: 'success' });
      setBillerName('');
      setAmount('');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Payment failed', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>💡 Bill Payments & Recharge</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Select Bill Type</label>
          <select value={billType} onChange={(e) => setBillType(e.target.value)}>
            <option value="Mobile Recharge">📱 Mobile Recharge</option>
            <option value="Electricity Bill">⚡ Electricity Bill</option>
            <option value="DTH Recharge">📺 DTH Recharge</option>
            <option value="Water Bill">🚰 Water Bill</option>
          </select>
        </div>
        
        <div className="input-group">
          <label>{billType === 'Mobile Recharge' ? 'Mobile Number' : 'Consumer Number / ID'}</label>
          <input 
            type="text" 
            placeholder="Enter number" 
            value={billerName} 
            onChange={(e) => setBillerName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label>Amount (₹)</label>
          <input 
            type="number" 
            placeholder="Enter amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Bills;
