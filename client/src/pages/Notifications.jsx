import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchNotifications = () => {
    api.get('/notifications').then(res => setNotifications(res.data)).catch(err => console.log(err));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/mark-all-read');
    setMsg('All notifications marked as read');
    setTimeout(() => setMsg(''), 2000);
    fetchNotifications();
  };

  const handleClearAll = async () => {
    await api.delete('/notifications/clear-all');
    setMsg('All notifications cleared');
    setTimeout(() => setMsg(''), 2000);
    fetchNotifications();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={32} color="#DBA030" /> Notifications
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleMarkAllRead} style={{ background: '#1A1A1A', color: '#FFF', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Mark All Read
            </button>
            <button onClick={handleClearAll} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        {msg && <div style={{ background: '#ECFDF5', color: '#10B981', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #A7F3D0', fontWeight: 500 }}>{msg}</div>}

        {notifications.length === 0 ? (
          <div style={{ background: '#FFF', padding: '3rem', borderRadius: '24px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Bell size={48} color="#DDD" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((n, i) => (
              <motion.div 
                key={n._id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                style={{ 
                  background: '#FFF', 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderLeft: !n.isRead ? '4px solid #DBA030' : '1px solid rgba(0,0,0,0.05)',
                  cursor: !n.isRead ? 'pointer' : 'default',
                  boxShadow: !n.isRead ? '0 4px 15px rgba(219,160,48,0.08)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A1A' }}>{n.title}</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>{n.message}</p>
                    <p style={{ color: '#AAA', fontSize: '0.8rem', marginTop: '0.8rem' }}>{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <div style={{ width: '10px', height: '10px', background: '#DBA030', borderRadius: '50%', marginLeft: '1rem', marginTop: '0.3rem' }}></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
