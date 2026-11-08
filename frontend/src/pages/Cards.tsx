import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Snowflake, Lock, Eye } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function Cards() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (!token || !userStr) { navigate('/login'); return; }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    const fetchCards = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/cards/${parsedUser.id}`);
        const data = await res.json();
        if (res.ok) setCard(data.data[0]);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchCards();
  }, [navigate]);

  const handleToggleFreeze = async () => {
    if (!card) return;
    try {
      const res = await fetch(`http://localhost:5001/api/cards/${card.id}/freeze`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) setCard(data.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!user || !card) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} onLogout={handleLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Cards</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className={`relative w-full max-w-md aspect-[1.586/1] rounded-3xl p-8 shadow-2xl transition-all duration-500 ${card.isFrozen ? 'grayscale opacity-50 bg-[#1C1C1E]' : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10'}`}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-2xl font-semibold tracking-widest text-white">FINBIT</h2>
                <p className="text-xs text-white/50 mt-1 uppercase">Virtual Debit</p>
              </div>
              <div className="w-12 h-8 bg-white/80 rounded-sm"></div>
            </div>
            
            <div className="mt-8">
              <p className="text-xl font-mono tracking-[0.2em] text-white">
                {showDetails ? card.cardNumber.replace(/(\d{4})/g, '$1 ') : '•••• •••• •••• ' + card.cardNumber.slice(-4)}
              </p>
            </div>

            <div className="flex justify-between items-end mt-8">
              <div>
                <p className="text-[10px] text-white/50 uppercase mb-1">Card Holder</p>
                <p className="text-sm font-medium text-white">{card.cardHolder}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase mb-1">Expires</p>
                <p className="text-sm font-medium text-white">{card.expiryDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase mb-1">CVV</p>
                <p className="text-sm font-medium text-white">{showDetails ? card.cvv : '•••'}</p>
              </div>
            </div>

            {card.isFrozen && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl backdrop-blur-sm">
                <div className="flex flex-col items-center text-white">
                  <Snowflake size={48} className="mb-2" />
                  <p className="font-semibold text-lg">Card Frozen</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Settings</h3>
            
            <div className="bg-[#1C1C1E] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Eye size={18} className="text-white" /></div>
                <div>
                  <p className="font-medium text-white">Show Details</p>
                  <p className="text-sm text-gray-500">View full number and CVV</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(!showDetails)} className={`w-12 h-7 rounded-full transition-colors relative ${showDetails ? 'bg-[#30D158]' : 'bg-gray-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md ${showDetails ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="bg-[#1C1C1E] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Lock size={18} className="text-white" /></div>
                <div>
                  <p className="font-medium text-white">Freeze Card</p>
                  <p className="text-sm text-gray-500">Temporarily disable transactions</p>
                </div>
              </div>
              <button onClick={handleToggleFreeze} className={`w-12 h-7 rounded-full transition-colors relative ${card.isFrozen ? 'bg-[#FF453A]' : 'bg-gray-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md ${card.isFrozen ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
