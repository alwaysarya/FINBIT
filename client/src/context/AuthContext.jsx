import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('finbit_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
