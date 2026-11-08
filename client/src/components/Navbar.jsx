import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🏦 FINBIT</Link>
      {user && (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/deposit">Deposit</Link>
          <Link to="/transfer">Transfer</Link>
          <Link to="/transactions">History</Link>
          <Link to="/profile" style={{ color: '#6366f1', fontWeight: 'bold' }}>👤 Profile</Link> {/* <-- Naya link */}
          <span className="welcome">Hi, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
