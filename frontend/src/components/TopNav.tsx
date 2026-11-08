import { useNavigate, useLocation } from 'react-router-dom';
import { Command, LayoutDashboard, Wallet, CreditCard, Send, Search, Bell, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  user: any;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  onLogout: () => void;
}

export default function TopNav({ user, searchQuery, setSearchQuery, onLogout }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { path: '/accounts', label: 'Accounts', icon: <Wallet size={16} /> },
    { path: '/cards', label: 'Cards', icon: <CreditCard size={16} /> },
    { path: '/transfers', label: 'Transfers', icon: <Send size={16} /> },
  ];

  return (
    <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0"><Command size={18} className="text-black" /></div>
          <span className="text-xl font-semibold tracking-tight hidden sm:block text-white">Finbit</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${location.pathname === item.path ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {setSearchQuery && (
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1C1C1E] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/20 w-64 transition-all text-white placeholder-gray-500" 
            />
          </div>
        )}
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><Bell size={20} className="text-gray-300" /></button>
        
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-white/10 transition-colors border border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#2C2C2E] flex items-center justify-center text-xs font-semibold text-white">{user?.name?.charAt(0)}</div>
            <span className="text-sm font-medium text-gray-200 hidden lg:block">{user.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-2">
              <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"><Settings size={16} /> Settings</button>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"><LogOut size={16} /> Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-300 hover:text-white p-2">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black z-50 p-4 flex flex-col gap-2 border-t border-white/10 overflow-y-auto">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${location.pathname === item.path ? 'bg-white text-black' : 'text-gray-300 hover:bg-[#1C1C1E]'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div className="h-px bg-white/10 my-2"></div>
          <button onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-[#1C1C1E]"><Settings size={18} /> Settings</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10"><LogOut size={18} /> Sign Out</button>
        </div>
      )}
    </header>
  );
}
