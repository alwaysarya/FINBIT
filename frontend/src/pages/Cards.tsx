import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Snowflake, Lock, Unlock, CreditCard, Wifi } from 'lucide-react';
import TopNav from '../components/TopNav';
import { apiFetch } from '../lib/api';

export default function Cards() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const userStr = localStorage.getItem('finbit_user');
        if (!userStr) return navigate('/login');
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        const res = await apiFetch(`/cards/${parsedUser.id}`);
        setCards(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, [navigate]);

  const handleToggleFreeze = async (cardId: string) => {
    setActionLoading(cardId);
    try {
      const res = await apiFetch(`/cards/${cardId}/freeze`, { method: 'PATCH' });
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFrozen: res.data.isFrozen } : c));
    } catch (err: any) {
      alert(err.message || 'Failed to update card');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} searchQuery="" setSearchQuery={() => {}} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/home')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-semibold tracking-tight">My Cards</h1>
        </div>

        {cards.length === 0 ? (
          <div className="text-center p-12 bg-[#1C1C1E] rounded-3xl border border-white/10">
            <CreditCard size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No cards found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className={`relative overflow-hidden rounded-3xl p-7 transition-all duration-500 shadow-2xl group flex flex-col justify-between aspect-[1.58/1] border ${
                  card.isFrozen 
                    ? 'bg-gray-800 border-gray-700 grayscale' 
                    : 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Premium Shine / Glossy Effect */}
                {!card.isFrozen && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                )}

                {card.isFrozen && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <div className="bg-black/60 px-5 py-2.5 rounded-full flex items-center gap-2 text-white font-medium border border-white/20 shadow-xl">
                      <Snowflake size={16} className="text-blue-400" /> Frozen
                    </div>
                  </div>
                )}

                {/* Top Row */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-lg tracking-widest uppercase">Finbit</span>
                    <Wifi size={24} className="text-white/70 rotate-90" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl italic font-bold tracking-tighter text-white/90">VISA</span>
                  </div>
                </div>

                {/* Middle (Card Number) */}
                <div className="relative z-10 mt-auto mb-6">
                  <p className="text-xl sm:text-2xl font-mono tracking-[0.15em] text-white/90 drop-shadow-md">
                    •••• •••• •••• {card.cardNumber.slice(-4)}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Card Holder</p>
                    <p className="font-medium tracking-wide text-sm">{card.cardHolder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Expires</p>
                    <p className="font-medium tracking-wide text-sm">{card.expiryDate}</p>
                  </div>
                </div>

                {/* Freeze Action Button */}
                <div className="absolute top-1/2 right-0 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-30 h-full flex items-center pr-4">
                  <button 
                    onClick={() => handleToggleFreeze(card.id)}
                    disabled={actionLoading === card.id}
                    className={`flex flex-col items-center justify-center gap-2 w-14 h-20 rounded-l-xl backdrop-blur-md border border-white/10 shadow-lg ${
                      card.isFrozen ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'
                    }`}
                    title={card.isFrozen ? 'Unfreeze' : 'Freeze'}
                  >
                    {actionLoading === card.id ? <Loader2 size={20} className="animate-spin text-white" /> : card.isFrozen ? <Unlock size={20} className="text-white" /> : <Lock size={20} className="text-white" />}
                  </button>
                </div>

                {/* Extra Design Element */}
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
