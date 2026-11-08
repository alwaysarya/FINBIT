import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="page">
      <h1>👤 My Profile</h1>
      <div className="profile-card">
        <div className="profile-row">
          <span className="label">Full Name</span>
          <span className="value">{user.name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email Address</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Phone Number</span>
          <span className="value">{user.phone || 'Not provided'}</span>
        </div>
        <div className="profile-row">
          <span className="label">Account Number</span>
          <span className="value">{user.account?.accountNumber}</span>
        </div>
        <div className="profile-row">
          <span className="label">Account Type</span>
          <span className="value" style={{ textTransform: 'capitalize' }}>
            {user.account?.accountType}
          </span>
        </div>
        <div className="profile-row">
          <span className="label">Current Balance</span>
          <span className="value" style={{ color: '#10b981', fontWeight: 'bold' }}>
            ₹ {user.account?.balance?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
