import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowUpRight, ArrowDownRight, Search, Plus, ChevronRight } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function Transfers() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (!token || !userStr) { navigate('/login'); return; }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    const fetchTx = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/transactions/${parsedUser.id}`);
        const data = await res.json();
        if (res.ok) setTransactions(data.data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchTx();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const filteredTx = transactions.filter(tx => (tx.description || tx.type).toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">History</h1>
        </div>

        <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/10">
          {filteredTx.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transfer history found.</div>
          ) : (
            filteredTx.map((tx, i) => (
              <div key={tx.id} className={`flex items-center justify-between p-4 sm:p-5 hover:bg-[#2C2C2E] transition-colors cursor-pointer ${i !== filteredTx.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'TRANSFER_IN' ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-white/10 text-white'}`}>
                    {tx.type === 'TRANSFER_IN' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-white">{tx.description || tx.type}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-semibold ${tx.type === 'TRANSFER_IN' ? 'text-[#30D158]' : 'text-white'}`}>
                    {tx.type === 'TRANSFER_IN' ? '+' : '-'}${(tx.amount / 100).toFixed(2)}
                  </p>
                  <ChevronRight size={18} className="text-gray-600" />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
