import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Copy, Check, Loader2 } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function Accounts() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (!token || !userStr) { navigate('/login'); return; }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/accounts/${parsedUser.id}`);
        const data = await res.json();
        if (res.ok) setAccounts(data.data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchAccounts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} onLogout={handleLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your Accounts</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-[#1C1C1E] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Savings Account</p>
                  <p className="text-xs text-gray-500">{acc.currency}</p>
                </div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center"><Wallet size={16} className="text-black" /></div>
              </div>

              <div className="mb-8 relative z-10">
                <p className="text-gray-400 text-sm font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-semibold tracking-tight">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(acc.balance / 100)}
                </h2>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Account Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-gray-300">{acc.accountNumber}</p>
                    <button onClick={() => copyToClipboard(acc.accountNumber)} className="text-gray-500 hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-[#30D158]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
