import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Plus, Loader2, Search, ChevronRight } from 'lucide-react';
import TopNav from '../components/TopNav';
import { apiFetch } from '../lib/api';

export default function Transfers() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const userStr = localStorage.getItem('finbit_user');
        if (!userStr) return navigate('/login');
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        const res = await apiFetch(`/transactions/${parsedUser.id}`);
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTx();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const filtered = transactions.filter(tx => 
    (tx.description || tx.type).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <TopNav user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-semibold mb-6">History</h1>
        
        <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/10">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions found.</div>
          ) : (
            filtered.map((tx, i) => (
              <div 
                key={tx.id} 
                onClick={() => navigate(`/transaction/${tx.id}`)} 
                className={`flex items-center justify-between p-4 sm:p-5 hover:bg-[#2C2C2E] transition-colors cursor-pointer ${i !== filtered.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-white/10 text-white'}`}>
                    {tx.type === 'TRANSFER_IN' ? <ArrowDownRight size={20} /> : tx.type === 'DEPOSIT' ? <Plus size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-white">{tx.description || tx.type}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-semibold ${tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? 'text-[#30D158]' : 'text-white'}`}>
                    {tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT' ? '+' : '-'}₹{(tx.amount / 100).toFixed(2)}
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
