import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const userStr = localStorage.getItem('finbit_user');
        if (!userStr) return navigate('/login');
        const user = JSON.parse(userStr);
        
        const res = await apiFetch(`/transactions/${user.id}`);
        const found = res.data.find((t: any) => t.id === id);
        setTx(found);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTx();
  }, [id, navigate]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!tx) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Transaction not found</div>;

  const isCredit = tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT';

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <header className="flex items-center p-4 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Transaction Details</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          {isCredit ? <CheckCircle2 size={40} className="text-[#30D158]" /> : <XCircle size={40} className="text-[#FF453A]" />}
        </div>
        
        <h2 className={`text-4xl font-bold mb-2 ${isCredit ? 'text-[#30D158]' : 'text-white'}`}>
          {isCredit ? '+' : '-'}₹{(tx.amount / 100).toFixed(2)}
        </h2>
        <p className="text-gray-400 mb-8">{tx.description || tx.type}</p>

        <div className="w-full bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-gray-400">Status</span>
            <span className="text-white flex items-center gap-1"><CheckCircle2 size={16} className="text-[#30D158]"/> Completed</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-gray-400">Date</span>
            <span>{new Date(tx.createdAt).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-gray-400">Transaction Type</span>
            <span>{tx.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Transaction ID</span>
            <span className="text-xs text-gray-500 font-mono break-all text-right ml-4">{tx.id}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
