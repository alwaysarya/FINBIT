import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Cards from './pages/Cards';
import Transfers from './pages/Transfers';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('finbit_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

// Dynamic page titles
const TitleManager = () => {
  const path = window.location.pathname;
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Finbit — Financial Infrastructure',
      '/login': 'Sign In — Finbit',
      '/register': 'Create Account — Finbit',
      '/home': 'Dashboard — Finbit',
      '/accounts': 'Accounts — Finbit',
      '/cards': 'Cards — Finbit',
      '/transfers': 'Transfers — Finbit',
      '/settings': 'Settings — Finbit',
    };
    document.title = titles[path] || 'Finbit';
  }, [path]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
        <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
