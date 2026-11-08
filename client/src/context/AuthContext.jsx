import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('finbit_theme') || 'dark');

  useEffect(() => {
    const saved = localStorage.getItem('finbit_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // Theme change hone pe body me class add/remove karo
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('finbit_theme', theme);
  }, [theme]);

  const login = (userData) => {
    localStorage.setItem('finbit_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('finbit_user');
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    const updated = { ...user, account: { ...user.account, balance: newBalance } };
    localStorage.setItem('finbit_user', JSON.stringify(updated));
    setUser(updated);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateBalance, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
