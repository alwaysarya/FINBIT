import { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

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
    setToast({ message: 'All notifications marked as read', type: 'success' });
    fetchNotifications();
  };

  const handleClearAll = async () => {
    await api.delete('/notifications/clear-all');
    setToast({ message: 'All notifications cleared', type: 'success' });
    fetchNotifications();
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>🔔 Notifications</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleMarkAllRead} className="edit-btn">Mark All Read</button>
          <button onClick={handleClearAll} className="edit-btn" style={{ background: '#ef4444' }}>Clear All</button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">No notifications yet.</div>
      ) : (
        <div className="txn-list">
          {notifications.map(n => (
            <div 
              key={n._id} 
              className={`txn-item ${!n.isRead ? 'unread' : ''}`}
              style={{ borderLeft: !n.isRead ? '4px solid #6366f1' : '1px solid #334155', cursor: 'pointer' }}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
            >
              <div className="txn-details">
                <p className="txn-type">{n.title}</p>
                <p className="txn-desc">{n.message}</p>
                <p className="txn-date">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && <span style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%' }}></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
