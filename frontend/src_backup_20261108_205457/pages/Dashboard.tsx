import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Agar auth clear karna hai toh yahan kar (localStorage.clear() etc)
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-white/20">
      
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-[#151515] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border border-white"></div>
          </div>
          <span className="text-xl font-light tracking-[0.2em]">FINBIT</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
              A
            </div>
            <span className="text-sm text-slate-300 hidden md:block">Aryan Thakur</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Overview</h1>
            <p className="text-slate-400 text-sm">Welcome back, here is your financial summary.</p>
          </div>
          <button className="px-5 py-2 text-sm bg-white text-black font-medium rounded-lg hover:bg-slate-200 transition-all">
            + New Transaction
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Wallet size={20} className="text-slate-300" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +12.5%
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Balance</p>
            <h2 className="text-3xl font-semibold">$48,250.00</h2>
          </div>

          <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +8.2%
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Income (This Month)</p>
            <h2 className="text-3xl font-semibold">$12,400.00</h2>
          </div>

          <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                <ArrowDownRight size={12} /> -3.1%
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Expenses (This Month)</p>
            <h2 className="text-3xl font-semibold">$3,850.00</h2>
          </div>
        </div>

        {/* Chart & Recent Transactions Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Area (Dummy Visual) */}
          <div className="lg:col-span-2 bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-medium mb-6">Cash Flow</h3>
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
              {/* Fake Bars for Chart */}
              {[40, 70, 45, 90, 65, 85, 100, 50, 75, 60, 80, 95].map((height, i) => (
                <div key={i} className="w-full bg-white/10 rounded-t-sm hover:bg-white/30 transition-all relative group" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${height * 100}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-medium mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {[
                { name: 'AWS Cloud Services', type: 'Expense', amount: '-$240.00', icon: '☁️' },
                { name: 'Client Payment (Acme)', type: 'Income', amount: '+$4,500.00', icon: '💰' },
                { name: 'Figma Subscription', type: 'Expense', amount: '-$45.00', icon: '🎨' },
                { name: 'Stripe Payout', type: 'Income', amount: '+$1,200.00', icon: '💳' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">
                      {tx.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.name}</p>
                      <p className="text-xs text-slate-500">{tx.type}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${tx.type === 'Income' ? 'text-green-400' : 'text-slate-300'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-lg transition-all">
              View All Transactions
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
