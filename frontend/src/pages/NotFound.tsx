import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-8">
        <Command size={32} className="text-black" />
      </div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-slate-400 mb-8">The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-all">
        Back to Home
      </button>
    </div>
  );
}
