import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/otp/send', { email, purpose: 'reset' });
      setToast({ message: res.data.message, type: 'success' });
      setStep(2);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send OTP', type: 'error' });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/otp/verify', { email, otp });
      await api.post('/auth/reset-password-direct', { email, newPassword });
      setToast({ message: 'Password reset successful! Login now.', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Reset failed', type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="auth-box">
        <h1>🏦 FINBIT</h1>
        <h2>Forgot Password</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>Check your terminal for OTP</p>
            <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit">Reset Password</button>
          </form>
        )}
        <p>Remember it? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
