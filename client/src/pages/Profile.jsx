import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', form);
      login({ ...user, name: res.data.name, phone: res.data.phone });
      setToast({ message: 'Profile updated!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/change-password', passForm);
      setToast({ message: res.data.message, type: 'success' });
      setIsChangingPass(false);
      setPassForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>👤 My Profile</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit Profile</button>}
          <button onClick={() => setIsChangingPass(true)} className="edit-btn" style={{ background: '#ef4444' }}>🔒 Change Password</button>
        </div>
      </div>

      <div className="profile-card">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="form">
            <div className="input-group">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#475569' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-row"><span className="label">Full Name</span><span className="value">{user.name}</span></div>
            <div className="profile-row"><span className="label">Email</span><span className="value">{user.email}</span></div>
            <div className="profile-row"><span className="label">Phone</span><span className="value">{user.phone || 'Not provided'}</span></div>
            <div className="profile-row"><span className="label">Account No.</span><span className="value">{user.account?.accountNumber}</span></div>
            <div className="profile-row"><span className="label">Balance</span><span className="value" style={{ color: '#10b981', fontWeight: 'bold' }}>₹ {user.account?.balance?.toLocaleString()}</span></div>
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {isChangingPass && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🔒 Change Password</h2>
            <form onSubmit={handlePasswordChange} className="form">
              <input 
                type="password" 
                placeholder="Current Password" 
                value={passForm.currentPassword} 
                onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} 
                required 
              />
              <input 
                type="password" 
                placeholder="New Password (min 6)" 
                value={passForm.newPassword} 
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} 
                required 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="submit">Update Password</button>
                <button type="button" onClick={() => setIsChangingPass(false)} style={{ background: '#475569' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
