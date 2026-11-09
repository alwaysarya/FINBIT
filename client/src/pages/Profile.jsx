import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Hash, Wallet, Edit, Key } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.put('/auth/profile', form);
      login({ ...user, name: res.data.name, phone: res.data.phone });
      setMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.put('/auth/change-password', passForm);
      setMsg(res.data.message);
      setIsChangingPass(false);
      setPassForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={32} color="#DBA030" /> My Profile
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Edit size={16} /> Edit Profile
                </button>
              )}
              <button onClick={() => setIsChangingPass(true)} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} /> Change Password
              </button>
            </div>
          </div>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #FCA5A5', fontWeight: 500 }}>{error}</div>}

          <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            {/* Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid #F0F0F0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #DBA030 0%, #F2C879 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A1A' }}>{user.name}</h2>
                <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.2rem' }}>{user.email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }} />
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginTop: '0.5rem' }}>Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button type="submit" style={{ flex: 1, background: '#DBA030', color: '#FFF', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InfoRow icon={<User size={18} color="#DBA030" />} label="Full Name" value={user.name} />
                <InfoRow icon={<Mail size={18} color="#DBA030" />} label="Email" value={user.email} />
                <InfoRow icon={<Phone size={18} color="#DBA030" />} label="Phone" value={user.phone || 'Not provided'} />
                <InfoRow icon={<Hash size={18} color="#DBA030" />} label="Account Number" value={user.account?.accountNumber} />
                <InfoRow icon={<Wallet size={18} color="#DBA030" />} label="Balance" value={`₹ ${user.account?.balance?.toLocaleString()}`} highlight />
              </div>
            )}
          </div>
        </motion.div>

        {/* Change Password Modal */}
        {isChangingPass && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1A1A1A' }}>Change Password</h2>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="password" placeholder="Current Password" value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }} required />
                <input type="password" placeholder="New Password (min 6)" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none' }} required />
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button type="submit" style={{ flex: 1, background: '#DBA030', color: '#FFF', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
                  <button type="button" onClick={() => setIsChangingPass(false)} style={{ flex: 1, background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, highlight }) => (
  <div style={{ background: '#FCF9F2', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
      {icon}
      <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>{label}</p>
    </div>
    <p style={{ fontSize: highlight ? '1.3rem' : '1rem', fontWeight: 700, color: highlight ? '#10B981' : '#1A1A1A' }}>{value}</p>
  </div>
);

export default Profile;
