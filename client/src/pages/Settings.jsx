import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings as SettingsIcon, Shield, Bell, Sun, Moon } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(AuthContext);
  const [settings, setSettings] = useState({ notifications: true, twoFactor: false });
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data)).catch(err => console.log(err));
    api.get('/settings/login-history').then(res => setHistory(res.data)).catch(err => console.log(err));
  }, []);

  const handleSave = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await api.put('/settings', newSettings);
      setMsg('Settings saved successfully!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const getBrowserName = (ua) => {
    if (ua.includes('Chrome')) return 'Chrome Browser';
    if (ua.includes('Safari')) return 'Safari Browser';
    if (ua.includes('Firefox')) return 'Firefox';
    return 'Web Browser';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={32} color="#DBA030" /> Settings
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Manage your account preferences and security.</p>

          {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}

          <div style={{ background: '#FFF', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden', marginBottom: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F0F0F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#FCF9F2', padding: '10px', borderRadius: '12px' }}><Bell size={20} color="#DBA030" /></div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Push Notifications</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.2rem' }}>Receive alerts for transactions and login attempts.</p>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={settings.notifications} onChange={(e) => handleSave('notifications', e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F0F0F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#FCF9F2', padding: '10px', borderRadius: '12px' }}>
                  {theme === 'dark' ? <Moon size={20} color="#DBA030" /> : <Sun size={20} color="#DBA030" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Theme</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.2rem' }}>Switch between light and dark mode.</p>
                </div>
              </div>
              <button onClick={toggleTheme} style={{ background: '#F9F9F9', border: '1px solid #E5E5E5', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', color: '#1A1A1A', fontSize: '0.9rem' }}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#FCF9F2', padding: '10px', borderRadius: '12px' }}><Shield size={20} color="#DBA030" /></div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Two-Factor Authentication</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.2rem' }}>Add an extra layer of security.</p>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={settings.twoFactor} onChange={(e) => handleSave('twoFactor', e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>Login History</h2>
          <div style={{ background: '#FFF', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {history.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No login history found.</p>
            ) : (
              history.map((h, i) => (
                <div key={h._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem', borderBottom: i < history.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <div style={{ background: '#FCF9F2', padding: '10px', borderRadius: '50%' }}><Shield size={18} color="#DBA030" /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.95rem' }}>{getBrowserName(h.device)}</p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>{new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                  <span style={{ color: h.status === 'success' ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>
                    {h.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
