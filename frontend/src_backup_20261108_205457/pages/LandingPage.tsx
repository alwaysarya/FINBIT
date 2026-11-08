import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Command, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Command size={18} className="text-black" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Finbit</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2">Log in</button>
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-all">Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 p-6 flex flex-col gap-4">
            <a href="#features" className="text-slate-300 hover:text-white">Features</a>
            <a href="#security" className="text-slate-300 hover:text-white">Security</a>
            <a href="#contact" className="text-slate-300 hover:text-white">Contact</a>
            <hr className="border-white/10" />
            <button onClick={() => navigate('/login')} className="text-left text-white font-medium">Log in</button>
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm bg-white text-black font-semibold rounded-lg w-full">Get Started</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6 max-w-4xl leading-tight">
          The financial OS for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white">modern companies.</span>
        </motion.h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-10">Manage revenue, expenses, and global payouts with a single unified API and real-time analytics dashboard.</p>
        <button onClick={() => navigate('/login')} className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-all flex items-center gap-2">
          Start for free <ArrowRight size={18} />
        </button>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/5 py-12 bg-[#0a0a0a] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm gap-6">
          <div className="flex items-center gap-3">
            <Command size={16} className="text-slate-400" />
            <span>© {new Date().getFullYear()} Finbit Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="mailto:hello@finbit.com" className="hover:text-white transition-colors">hello@finbit.com</a>
            <a href="tel:+911234567890" className="hover:text-white transition-colors">+91 12345 67890</a>
            <a href="/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
