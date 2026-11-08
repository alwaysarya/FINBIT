import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/account/notifications').then(res => setNotifications(res.data)).catch(err => console.log(err));
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🏦 FINBIT</Link>
      <div className="nav-links">
        <button onClick={toggleTheme} className="theme-toggle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/card">My Card</Link>
            <Link to="/transfer">Transfer</Link>
            <Link to="/scheduled">📅 Scheduled</Link> {/* <-- NAYA LINK */}
            <Link to="/requests">Requests</Link>
            <Link to="/rewards">🎁 Rewards</Link>
            <Link to="/goals">Goals</Link>
            <Link to="/fd">FD</Link>
            <Link to="/bills">Bills</Link>
            <Link to="/transactions">History</Link>
            <Link to="/profile" style={{ color: '#6366f1', fontWeight: 'bold' }}>👤 Profile</Link>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}>
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              {showDropdown && (
                <div className="notif-dropdown">
                  <h4>Notifications</h4>
                  {notifications.length === 0 ? <p>No notifications</p> : notifications.map(n => (
                    <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                      <strong>{n.title}</strong><p>{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="welcome">Hi, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
