import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('finbit_token');
        localStorage.removeItem('finbit_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any, token: string) => {
    localStorage.setItem('finbit_token', token);
    localStorage.setItem('finbit_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/home');
  };

  const logout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
