import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Lock, Save } from 'lucide-react';
import TopNav from '../components/TopNav';
import { apiFetch } from '../lib/api';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('finbit_user');
    return u ? JSON.parse(u) : null;
  });

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await apiFetch('/profile/update', {
        method: 'PUT',
        body: JSON.stringify({
          userId: user.id,
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        })
      });

      if (res.data) {
        localStorage.setItem('finbit_user', JSON.stringify(res.data));
        setUser(res.data);
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Something went wrong', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <TopNav user={user} searchQuery="" setSearchQuery={() => {}} onLogout={() => {
        localStorage.clear();
        navigate('/login');
      }} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/home')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-[#FF453A]/10 text-[#FF453A]'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Profile Section */}
          <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User size={18} /> Profile Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full bg-black/50 border border-white/5 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-600 mt-1">Email cannot be changed.</p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lock size={18} /> Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password to change"
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Min 6 characters"
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold p-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
