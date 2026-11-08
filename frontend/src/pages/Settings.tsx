import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Loader2 } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('finbit_user') || '{}'));
  const [name, setName] = useState(user.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('finbit_user', JSON.stringify({ ...user, name: data.data.name }));
      setUser({ ...user, name: data.data.name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally { setIsLoading(false); }
  };

  if (!user.id) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-56 space-y-1">
            {[
              { icon: <User size={16} />, label: 'Profile' },
              { icon: <Shield size={16} />, label: 'Security' },
              { icon: <Bell size={16} />, label: 'Notifications' },
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.label ? 'bg-[#1C1C1E] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1C1C1E]/50'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-2xl">
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-[#30D158]/10 border-[#30D158]/20 text-[#30D158]' : 'bg-[#FF453A]/10 border-[#FF453A]/20 text-[#FF453A]'}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'Profile' && (
              <form onSubmit={handleUpdateProfile} className="bg-[#1C1C1E] border border-white/10 p-6 md:p-8 rounded-3xl">
                <h2 className="text-xl font-semibold mb-6 text-white">Personal Information</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-base text-gray-200 focus:border-gray-500 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-base text-gray-500 cursor-not-allowed" />
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <h3 className="text-base font-semibold mb-4 text-white">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-base text-gray-200 focus:border-gray-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-base text-gray-200 focus:border-gray-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-gray-200 mt-6 transition-all flex items-center gap-2">
                    {isLoading && <Loader2 size={16} className="animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
