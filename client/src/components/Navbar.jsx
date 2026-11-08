import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => setNotifications(res.data)).catch(err => console.log(err));
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };
  if (!user) return null;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🏦 FINBIT</Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transfer">Transfer</Link>
        <Link to="/budget">📊 Budget</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/rd">RD</Link> {/* <-- NAYA LINK */}
        <Link to="/card">My Card</Link>
        <Link to="/fd">FD</Link>
        <Link to="/bills">Bills</Link>
        <Link to="/transactions">History</Link>
        <Link to="/refer">🎁 Refer</Link>
        <Link to="/support">Support</Link>
        <Link to="/settings">Settings</Link>
        
        <Link to="/notifications" style={{ textDecoration: 'none', position: 'relative' }}>
          <span style={{ fontSize: '1.2rem' }}>🔔</span>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link>
        
        <span className="welcome">Hi, {user.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
