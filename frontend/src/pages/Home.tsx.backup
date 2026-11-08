import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Plus, TrendingUp, Loader2, Send, Wallet, ChevronRight, ScanLine, CreditCard, Users } from 'lucide-react';
import TransferModal from '../components/TransferModal';
import AddMoneyModal from '../components/AddMoneyModal';
import Toast from '../components/Toast';
import TopNav from '../components/TopNav';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0 });
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as const });

  const fetchData = async (userId: string) => {
    try {
      const token = localStorage.getItem('finbit_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [txRes, chartRes, statsRes, bnfRes] = await Promise.all([
        fetch(`http://localhost:5001/api/transactions/${userId}`, { headers }),
        fetch(`http://localhost:5001/api/analytics/${userId}`, { headers }),
        fetch(`http://localhost:5001/api/dashboard/${userId}`, { headers }),
        fetch(`http://localhost:5001/api/beneficiaries/${userId}`, { headers })
      ]);
      
      const txData = await txRes.json();
      const chartData = await chartRes.json();
      const statsData = await statsRes.json();
      const bnfData = await bnfRes.json();
      
      if (txRes.ok) setTransactions(txData.data);
      if (chartRes.ok) setChartData(chartData.data);
      if (statsRes.ok) setStats(statsData.data);
      if (bnfRes.ok) setBeneficiaries(bnfData.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (!token || !userStr) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      fetchData(parsedUser.id);
    } catch (e) { navigate('/login'); } finally { setIsLoading(false); }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const filteredTransactions = transactions.filter(tx => (tx.description || tx.type).toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!user) return null;

  const formatMoney = (paise: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(paise / 100);
  const maxChartValue = Math.max(...chartData.flatMap(d => [d.income, d.expense]), 100);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <button onClick={() => setIsTransferModalOpen(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1C1C1E] border border-white/10 rounded-2xl hover:bg-[#2C2C2E] transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Send size={18} className="text-white" /></div>
            <span className="text-xs sm:text-sm font-medium text-gray-300">Send</span>
          </button>
          <button onClick={() => setIsAddMoneyModalOpen(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1C1C1E] border border-white/10 rounded-2xl hover:bg-[#2C2C2E] transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={18} className="text-white" /></div>
            <span className="text-xs sm:text-sm font-medium text-gray-300">Add</span>
          </button>
          <button onClick={() => navigate('/cards')} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1C1C1E] border border-white/10 rounded-2xl hover:bg-[#2C2C2E] transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><CreditCard size={18} className="text-white" /></div>
            <span className="text-xs sm:text-sm font-medium text-gray-300">Cards</span>
          </button>
          <button onClick={() => alert('Scan to Pay coming soon')} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1C1C1E] border border-white/10 rounded-2xl hover:bg-[#2C2C2E] transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><ScanLine size={18} className="text-white" /></div>
            <span className="text-xs sm:text-sm font-medium text-gray-300">Scan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative overflow-hidden bg-[#1C1C1E] rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                  <h2 className="text-5xl sm:text-6xl font-semibold tracking-tighter">{formatMoney(stats.balance)}</h2>
                </div>
                <div className="w-14 h-9 bg-white rounded-md flex items-center justify-center shadow-lg">
                  <Wallet size={20} className="text-black" />
                </div>
              </div>
              <div className="flex items-center gap-6 mt-12">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#30D158]"></div>
                  <span className="text-sm text-gray-300">Income: {formatMoney(stats.income)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF453A]"></div>
                  <span className="text-sm text-gray-300">Expense: {formatMoney(stats.expenses)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-gray-400 text-sm font-medium">Cash Flow</p>
              <TrendingUp size={20} className="text-white" />
            </div>
            <div className="mt-8 flex items-end gap-2 h-24">
              {chartData.slice(-6).map((data, i) => (
                <div key={i} className="flex-1 flex items-end gap-0.5 h-full">
                  <div className="w-full bg-[#30D158] opacity-80 rounded-sm" style={{ height: `${Math.max((data.income / maxChartValue) * 100, 5)}%` }}></div>
                  <div className="w-full bg-[#FF453A] opacity-80 rounded-sm" style={{ height: `${Math.max((data.expense / maxChartValue) * 100, 5)}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Users size={18} /> Send Again</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {beneficiaries.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">No saved contacts yet.</div>
            ) : (
              beneficiaries.map((bnf) => (
                <button key={bnf.id} onClick={() => setIsTransferModalOpen(true)} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div className="w-14 h-14 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-xl font-semibold text-white hover:bg-[#2C2C2E] transition-colors">
                    {bnf.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-400 truncate w-full text-center">{bnf.name.split(' ')[0]}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-2xl font-semibold tracking-tight">Recent Activity</h3>
            <button onClick={() => navigate('/transfers')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              See All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/10">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent activity.</div>
            ) : (
              filteredTransactions.slice(0, 5).map((tx, i) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 sm:p-5 hover:bg-[#2C2C2E] transition-colors cursor-pointer ${i !== Math.min(filteredTransactions.length, 5) - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-white/10 text-white'}`}>
                      {tx.type === 'TRANSFER_IN' ? <ArrowDownRight size={20} /> : tx.type === 'DEPOSIT' ? <Plus size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-white">{tx.description || tx.type}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold ${tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? 'text-[#30D158]' : 'text-white'}`}>
                      {tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? '+' : '-'}${(tx.amount / 100).toFixed(2)}
                    </p>
                    <ChevronRight size={18} className="text-gray-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} userId={user.id} onSuccess={() => fetchData(user.id)} />
      <AddMoneyModal isOpen={isAddMoneyModalOpen} onClose={() => setIsAddMoneyModalOpen(false)} userId={user.id} onSuccess={() => fetchData(user.id)} />
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
