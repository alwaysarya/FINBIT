import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Command, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('finbit_token', data.data.token);
      localStorage.setItem('finbit_user', JSON.stringify(data.data.user));
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-white/20">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-2xl">
            <Command size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to access your FINBIT account</p>
        </div>

        {error && <div className="mb-6 p-4 bg-[#FF453A]/10 border border-[#FF453A]/20 text-[#FF453A] text-sm rounded-xl text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-5 py-4 bg-[#1C1C1E] border border-white/10 rounded-xl text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
          </div>
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-5 py-4 bg-[#1C1C1E] border border-white/10 rounded-xl text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-black font-semibold text-base rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4">
            {isLoading ? <><Loader2 size={20} className="animate-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-white font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
