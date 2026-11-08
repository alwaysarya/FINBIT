import { useState } from 'react';
import { X, Plus, Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import Toast from './Toast';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export default function AddMoneyModal({ isOpen, onClose, userId, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as const });

  if (!isOpen && !toast.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation based on method
      if (method === 'UPI' && !upiId.includes('@')) {
        throw new Error('Please enter a valid UPI ID (e.g. name@bank)');
      }
      if (method === 'Card' && cardNumber.length < 12) {
        throw new Error('Please enter a valid card number');
      }

      const amountInPaise = Math.round(parseFloat(amount) * 100);

      const res = await fetch('http://localhost:5001/api/topup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('finbit_token')}`
        },
        body: JSON.stringify({ 
          userId, 
          amount: amountInPaise,
          method,
          reference: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add money');

      onSuccess();
      onClose();
      
      setToast({ isOpen: true, message: `Successfully added $${(amountInPaise / 100).toFixed(2)}`, type: 'success' });
      setTimeout(() => setToast(prev => ({ ...prev, isOpen: false })), 3000);
      
      // Reset
      setAmount(''); setUpiId(''); setCardNumber(''); setBankName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1E] border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Add Money</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
            </div>

            {error && <div className="mb-6 p-3 bg-[#FF453A]/10 text-[#FF453A] text-sm rounded-xl border border-[#FF453A]/20">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Add (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    step="0.01" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="w-full pl-8 pr-4 py-4 bg-black border border-white/10 rounded-xl text-2xl font-semibold text-white focus:border-gray-500 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI', icon: <Smartphone size={18} /> },
                    { id: 'Card', label: 'Card', icon: <CreditCard size={18} /> },
                    { id: 'NetBanking', label: 'Bank', icon: <Building2 size={18} /> },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${method === m.id ? 'bg-white text-black border-white' : 'bg-black text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                      {m.icon}
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Fields based on Method */}
              {method === 'UPI' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">UPI ID</label>
                  <input type="text" required placeholder="e.g. aryan@okhdfcbank" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                </div>
              )}

              {method === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Card Number</label>
                    <input type="text" required placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" maxLength={16} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Expiry</label>
                      <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">CVV</label>
                      <input type="password" required placeholder="•••" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" maxLength={3} />
                    </div>
                  </div>
                </div>
              )}

              {method === 'NetBanking' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Bank</label>
                  <select required value={bankName} onChange={e => setBankName(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all appearance-none">
                    <option value="">Select your bank</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <button type="submit" disabled={loading} className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  {loading ? 'Processing...' : 'Add Money'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <span className="text-green-500">🔒</span> Secure payment powered by FINBIT Gateway
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </>
  );
}
