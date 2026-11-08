import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Settings = () => {
  const { theme, toggleTheme } = useContext(AuthContext);
  const [settings, setSettings] = useState({ notifications: true, twoFactor: false });
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data)).catch(err => console.log(err));
    api.get('/settings/login-history').then(res => setHistory(res.data)).catch(err => console.log(err));
  }, []);

  const handleSave = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await api.put('/settings', newSettings);
      setToast({ message: 'Settings saved!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save', type: 'error' });
    }
  };

  const getBrowserName = (ua) => {
    if (ua.includes('Chrome')) return 'Chrome Browser';
    if (ua.includes('Safari')) return 'Safari Browser';
    if (ua.includes('Firefox')) return 'Firefox';
    return 'Web Browser';
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>⚙️ Account Settings</h1>

      <div className="settings-card">
        <div className="setting-row">
          <div><h3>Push Notifications</h3><p>Receive alerts for transactions and login attempts.</p></div>
          <label className="switch"><input type="checkbox" checked={settings.notifications} onChange={(e) => handleSave('notifications', e.target.checked)} /><span className="slider"></span></label>
        </div>

        <div className="setting-row">
          <div><h3>Appearance (Theme)</h3><p>Switch between light and dark mode.</p></div>
          <button onClick={toggleTheme} className="edit-btn">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
        </div>

        <div className="setting-row">
          <div><h3>Two-Factor Authentication (2FA)</h3><p>Add an extra layer of security to your account.</p></div>
          <label className="switch"><input type="checkbox" checked={settings.twoFactor} onChange={(e) => handleSave('twoFactor', e.target.checked)} /><span className="slider"></span></label>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem' }}>🛡️ Login History</h2>
      <div className="txn-list">
        {history.length === 0 ? <p>No login history found.</p> : history.map(h => (
          <div key={h._id} className="txn-item">
            <div className="txn-icon">💻</div>
            <div className="txn-details">
              <p className="txn-type">{getBrowserName(h.device)}</p>
              <p className="txn-date">{new Date(h.createdAt).toLocaleString()}</p>
            </div>
            <span className={`txn-amount ${h.status === 'success' ? 'text-green' : 'text-red'}`}>
              {h.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
