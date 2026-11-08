import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, ChevronRight } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('finbit_token');
    const userStr = localStorage.getItem('finbit_user');
    if (!token || !userStr) { navigate('/login'); return; }
    
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/users');
        const data = await res.json();
        if (res.ok) setUsers(data.data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('finbit_token');
    localStorage.removeItem('finbit_user');
    navigate('/login');
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white/20">
      <TopNav user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all registered users</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1E] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder-gray-500" 
            />
          </div>
        </div>

        <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/10">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found.</div>
          ) : (
            filteredUsers.map((u, i) => (
              <div key={u.id} className={`flex items-center justify-between p-4 sm:p-5 hover:bg-[#2C2C2E] transition-colors cursor-pointer ${i !== filteredUsers.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-white">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((u.accounts[0]?.balance || 0) / 100)}
                    </p>
                    <p className="text-xs text-gray-500">{u.accounts[0]?.accountNumber || 'No Account'}</p>
                  </div>
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
