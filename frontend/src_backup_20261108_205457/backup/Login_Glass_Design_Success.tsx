import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Backend integration pending!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-[#0A0A0A]">
      
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
        alt="Bank Building" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale contrast-125"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glass Card Container - CHHOTA AUR ROUNDED */}
      <div 
        className="relative z-10 flex flex-col items-center border border-white/20 p-8 sm:p-10"
        style={{ width: '90%', maxWidth: '420px' }}
        style={{ 
          borderRadius: '24px', 
          backgroundColor: 'rgba(20, 20, 20, 0.75)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' 
        }}
      >
        
        {/* Logo/Icon */}
        <div className="w-14 h-14 mb-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15 15 0 0 0 0 18 15 15 0 0 0 0-18Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="text-3xl font-serif text-white tracking-widest mb-1">FINBIT</h1>
        <p className="text-[12px] text-slate-400 mb-8 font-medium">Welcome, please login to the system.</p>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          
          {/* Username */}
          <div>
            <label className="block text-[13px] font-semibold text-white mb-1.5">Username</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:bg-black/80 transition-all"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-semibold text-white mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:bg-black/80 transition-all tracking-widest"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 bg-black/60 border-white/20 rounded text-blue-500 focus:ring-blue-500/50 cursor-pointer" />
              <label htmlFor="remember" className="text-[12px] font-medium text-slate-300 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-[12px] font-medium text-slate-300 hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white bg-[#4a5c78] hover:bg-[#5c7193] border border-white/10 transition-all"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-5 opacity-40">
          <div className="h-px bg-white flex-1"></div>
          <span className="text-[11px] text-white uppercase font-medium">or</span>
          <div className="h-px bg-white flex-1"></div>
        </div>

        {/* Footer Link */}
        <p className="text-[13px] text-slate-300 font-medium">
          Don't have an account? <Link to="/register" className="text-white hover:underline transition-all">Register Now</Link>
        </p>

      </div>

      {/* Bottom Copyright */}
      <div className="absolute bottom-6 text-slate-400 text-[11px] tracking-widest uppercase">
        FINBIT © 2026
      </div>

    </div>
  );
};

export default Login;
