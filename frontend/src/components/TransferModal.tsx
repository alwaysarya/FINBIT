import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import Toast from './Toast';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export default function TransferModal({ isOpen, onClose, userId, onSuccess }: TransferModalProps) {
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'Savings',
    amount: '',
    remarks: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as const });

  if (!isOpen && !toast.isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations (Standard Rule 4: Proper form validation)
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      setError('Invalid account number length');
      return;
    }
    if (formData.ifscCode.length !== 11) {
      setError('IFSC code must be exactly 11 characters');
      return;
    }

    setLoading(true);

    try {
      const amountInPaise = Math.round(parseFloat(formData.amount) * 100);
      
      // Abhi hum backend mein email ki jagah ek fake email generate kar rahe hain
      // Future mein isko account number se replace karenge
      const targetEmail = formData.remarks ? `${formData.beneficiaryName.toLowerCase().replace(/\s/g, '')}@finbit.com` : 'receiver@finbit.com';

      const res = await fetch('http://localhost:5001/api/transfers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('finbit_token')}`
        },
        body: JSON.stringify({ 
          senderId: userId, 
          receiverEmail: targetEmail, 
          amount: amountInPaise,
          beneficiaryName: formData.beneficiaryName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          remarks: formData.remarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Transfer failed');

      onSuccess();
      onClose();
      
      setToast({ isOpen: true, message: `₹${formData.amount} sent to ${formData.beneficiaryName}`, type: 'success' });
      setTimeout(() => setToast(prev => ({ ...prev, isOpen: false })), 3000);
      
      // Reset form
      setFormData({
        beneficiaryName: '', accountNumber: '', confirmAccountNumber: '', ifscCode: '',
        bankName: '', branchName: '', accountType: 'Savings', amount: '', remarks: ''
      });

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
          <div className="bg-[#1C1C1E] border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Bank Transfer</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
            </div>

            {error && <div className="mb-6 p-3 bg-[#FF453A]/10 text-[#FF453A] text-sm rounded-xl border border-[#FF453A]/20">{error}</div>}

            <form onSubmit={handleTransfer} className="space-y-4">
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 border-b border-white/10 pb-2">Beneficiary Details</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Beneficiary Name</label>
                  <input type="text" name="beneficiaryName" required value={formData.beneficiaryName} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                    <input type="text" name="accountNumber" required value={formData.accountNumber} onChange={handleChange} placeholder="Enter account no." className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Confirm Account No.</label>
                    <input type="text" name="confirmAccountNumber" required value={formData.confirmAccountNumber} onChange={handleChange} placeholder="Re-enter account no." className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">IFSC Code</label>
                    <input type="text" name="ifscCode" required value={formData.ifscCode} onChange={handleChange} placeholder="e.g. HDFC0001234" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all uppercase" maxLength={11} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Bank Name</label>
                    <input type="text" name="bankName" required value={formData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Branch Name (Optional)</label>
                    <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="e.g. Andheri West" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                    <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all appearance-none">
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400">Transaction Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
                    <input type="number" name="amount" required min="1" step="0.01" placeholder="0.00" value={formData.amount} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Remarks (Optional)</label>
                    <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="e.g. Rent, Salary" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-gray-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 mt-6 flex items-center justify-center gap-2 transition-colors">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Processing Transfer...' : 'Transfer Funds'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </>
  );
}
