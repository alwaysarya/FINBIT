import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Landmark, Bell, LogOut, User, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => setNotifications(res.data)).catch(err => console.log(err));
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };
  if (!user) return null;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuConfig = {
    Accounts: [
      { name: 'Home', path: '/home' },
      { name: 'History', path: '/transactions' },
    ],
    Payments: [
      { name: 'Transfer', path: '/transfer' },
      { name: 'Bills', path: '/bills' },
    ],
    Wealth: [
      { name: 'Loans', path: '/loans' },
      { name: 'RD', path: '/rd' },
      { name: 'Card', path: '/card' },
      { name: 'FD', path: '/fd' },
    ],
    Services: [
      { name: 'Budget', path: '/budget' },
      { name: 'Support', path: '/support' },
      { name: 'Settings', path: '/settings' },
    ]
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem', height: '60px' }}>
      
      {/* 1. LEFT SIDE: LOGO */}
      <div style={{ flex: 1 }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#1A1A1A', fontWeight: 800, fontSize: '1.2rem' }}>
          <Landmark size={20} color="#1A1A1A" /> FINBIT
        </Link>
      </div>

      {/* 2. CENTER: MENUS */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {Object.keys(menuConfig).map(category => (
          <div 
            key={category} 
            style={{ position: 'relative', cursor: 'pointer', padding: '10px 0' }}
            onMouseEnter={() => setActiveMenu(category)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span style={{ color: '#1A1A1A', fontWeight: 600, fontSize: '0.95rem', padding: '5px 12px', borderRadius: '8px', transition: 'all 0.2s' }}>{category}</span>
            {activeMenu === category && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: '#FFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '10px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100 }}>
                {menuConfig[category].map(item => (
                  <Link key={item.name} to={item.path} className="dropdown-item">{item.name}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. RIGHT SIDE: NOTIFICATION & PROFILE */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/notifications" style={{ textDecoration: 'none', position: 'relative' }}>
          <Bell size={18} color="#1A1A1A" />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link>

        <div style={{ position: 'relative', cursor: 'pointer' }} onMouseEnter={() => setActiveMenu('Profile')} onMouseLeave={() => setActiveMenu(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#DBA030' }}>{user.name.charAt(0).toUpperCase()}</div>
            <span style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
          </div>
          {activeMenu === 'Profile' && (
            <div style={{ position: 'absolute', top: '100%', right: '0', background: '#FFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '10px', minWidth: '180px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100 }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem' }}><User size={16} /> My Profile</Link>
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem' }}><Settings size={16} /> Settings</Link>
              <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#EF4444', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '5px', borderTop: '1px solid #eee' }}><LogOut size={16} /> Logout</div>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
