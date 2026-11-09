import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, Download, FileText, FileDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Transactions = () => {
  const navigate = useNavigate();
  const [txns, setTxns] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/account/transactions').then((res) => { 
      setTxns(res.data); 
      setFilteredTxns(res.data); 
    }).catch(err => console.log(err)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = txns;
    if (filterType !== 'all') {
      result = result.filter(t => {
        const isCredit = t.type === 'credit' || (t.toAccount && user?.account?._id && t.toAccount._id === user.account._id);
        return filterType === 'credit' ? isCredit : !isCredit;
      });
    }
    if (searchTerm) {
      result = result.filter(t => (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) || t.amount.toString().includes(searchTerm));
    }
    setFilteredTxns(result);
  }, [searchTerm, filterType, txns, user]);

  const isCredit = (txn) => {
    if (txn.type === 'credit') return true;
    if (txn.toAccount && user?.account?._id && txn.toAccount._id === user.account._id) return true;
    return false;
  };

  const downloadCSV = () => {
    if (filteredTxns.length === 0) return;
    const headers = ['Transaction ID', 'Date', 'Mode', 'Type', 'Description', 'Amount', 'Status'];
    const rows = filteredTxns.map(t => [t._id, new Date(t.createdAt).toLocaleString(), t.mode || 'N/A', isCredit(t) ? 'Credit' : 'Debit', t.description || 'N/A', t.amount, t.status]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'finbit_statement.csv'; link.click();
  };

  const downloadPDF = async () => {
    if (filteredTxns.length === 0) return;
    
    let freshUser = user;
    try {
      const res = await api.get('/auth/me');
      freshUser = { ...user, ...res.data.user, account: res.data.account };
    } catch (err) { console.log('Fetch error:', err); }

    const invoiceNo = 'FIN-' + Date.now().toString().slice(-8);
    const today = new Date().toLocaleString();
    const totalCredit = filteredTxns.filter(t => isCredit(t)).reduce((a, b) => a + b.amount, 0);
    const totalDebit = filteredTxns.filter(t => !isCredit(t)).reduce((a, b) => a + b.amount, 0);

    const html = `
      <div style="padding: 40px; font-family: Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 800px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #DBA030; padding-bottom: 20px; margin-bottom: 25px;">
          <div>
            <h1 style="margin: 0; color: #DBA030; font-size: 42px; font-weight: 900;">FINBIT</h1>
            <p style="margin: 3px 0 0 0; color: #666; font-size: 11px; letter-spacing: 2px;">DIGITAL BANKING PLATFORM</p>
          </div>
          <div style="text-align: right; font-size: 12px; color: #555; line-height: 1.6;">
            <p style="margin: 0;"><strong>FINBIT Technologies Pvt. Ltd.</strong></p>
            <p style="margin: 0;">27, Dr Rajkumar Rd, Milk Colony, Subramanyanagar, 2nd Stage</p>
            <p style="margin: 0;">Malleshwaram / Rajajinagar, Bengaluru, Karnataka 560055</p>
            <p style="margin: 0;">support@finbit.com</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 22px; color: #1A1A1A;">ACCOUNT STATEMENT</h2>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #888;">Original for Customer</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div style="width: 55%; font-size: 12px; line-height: 1.7;">
            <p style="margin: 0; font-weight: bold; font-size: 11px; color: #888;">ACCOUNT HOLDER</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">${freshUser.name || 'N/A'}</p>
            <p style="margin: 2px 0 0 0;">Email: ${freshUser.email || 'N/A'}</p>
            <p style="margin: 2px 0 0 0;">Phone: ${freshUser.phone || 'N/A'}</p>
            <p style="margin: 2px 0 0 0;">Account No: ${freshUser.account?.accountNumber || 'N/A'}</p>
            <p style="margin: 2px 0 0 0;">Account Type: ${(freshUser.account?.accountType || 'savings').toUpperCase()}</p>
          </div>
          <div style="width: 40%; font-size: 12px; line-height: 1.7;">
            <p style="margin: 0; font-weight: bold; font-size: 11px; color: #888;">STATEMENT DETAILS</p>
            <div style="display: flex; justify-content: space-between; margin-top: 5px;"><span>Statement No:</span><span style="font-weight: bold;">${invoiceNo}</span></div>
            <div style="display: flex; justify-content: space-between; margin-top: 3px;"><span>Date:</span><span style="font-weight: bold;">${today}</span></div>
            <div style="display: flex; justify-content: space-between; margin-top: 3px;"><span>Total Transactions:</span><span style="font-weight: bold;">${filteredTxns.length}</span></div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #1A1A1A; color: white;">
              <th style="padding: 12px 10px; text-align: left; font-size: 10px;">S.No</th>
              <th style="padding: 12px 10px; text-align: left; font-size: 10px;">Date</th>
              <th style="padding: 12px 10px; text-align: left; font-size: 10px;">Description</th>
              <th style="padding: 12px 10px; text-align: left; font-size: 10px;">Mode</th>
              <th style="padding: 12px 10px; text-align: right; font-size: 10px;">Debit</th>
              <th style="padding: 12px 10px; text-align: right; font-size: 10px;">Credit</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTxns.map((t, i) => `
              <tr style="border-bottom: 1px solid #E5E5E5; background: ${i % 2 === 0 ? '#FFF' : '#FAFAFA'};">
                <td style="padding: 10px; font-size: 12px;">${i + 1}</td>
                <td style="padding: 10px; font-size: 12px;">${new Date(t.createdAt).toLocaleDateString()}</td>
                <td style="padding: 10px; font-size: 12px;">${t.description || 'Transfer'}</td>
                <td style="padding: 10px; font-size: 12px;">${t.mode || 'Internal'}</td>
                <td style="padding: 10px; font-size: 12px; text-align: right; color: #EF4444; font-weight: 600;">${!isCredit(t) ? t.amount.toFixed(2) : '-'}</td>
                <td style="padding: 10px; font-size: 12px; text-align: right; color: #10B981; font-weight: 600;">${isCredit(t) ? t.amount.toFixed(2) : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
          <div style="width: 45%; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E5E5;"><span>Total Debits:</span><span style="font-weight: bold; color: #EF4444;">₹ ${totalDebit.toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E5E5;"><span>Total Credits:</span><span style="font-weight: bold; color: #10B981;">₹ ${totalCredit.toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 2px solid #1A1A1A;"><span style="font-weight: bold;">Current Balance:</span><span style="font-weight: bold;">₹ ${(freshUser.account?.balance || 0).toFixed(2)}</span></div>
          </div>
        </div>

        <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #E5E5E5; display: flex; justify-content: space-between;">
          <div style="font-size: 10px; color: #888;">
            <p style="margin: 0;"><strong>Terms & Conditions:</strong></p>
            <p style="margin: 2px 0 0 0;">Computer-generated statement. No signature required.</p>
            <p style="margin: 2px 0 0 0;">Subject to Bengaluru jurisdiction.</p>
          </div>
          <div style="text-align: center; font-size: 10px; color: #888;">
            <p style="margin: 0; color: #DBA030; font-weight: bold;">For FINBIT Technologies Pvt. Ltd.</p>
            <div style="height: 30px;"></div>
            <p style="margin: 0; border-top: 1px solid #1A1A1A; padding-top: 3px;">Authorized Signatory</p>
          </div>
        </div>
      </div>
    `;

    html2pdf().from(html).set({
      margin: 0,
      filename: `FINBIT_Statement_${invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  if (loading) return <div style={{ minHeight: '100vh', background: '#FCF9F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={32} color="#DBA030" /> Transactions
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={downloadPDF} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileDown size={16} /> Download PDF
            </button>
            <button onClick={downloadCSV} style={{ background: '#1A1A1A', color: '#FFF', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div style={{ background: '#FFF', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '0.95rem', outline: 'none' }} />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}>
            <option value="all">All Types</option>
            <option value="credit">Income</option>
            <option value="debit">Expense</option>
          </select>
        </div>
        
        {filteredTxns.length === 0 ? (
          <div style={{ background: '#FFF', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#888', border: '1px solid rgba(0,0,0,0.05)' }}>No transactions found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {filteredTxns.map((t, i) => {
              const credit = isCredit(t);
              return (
                <motion.div 
                  key={t._id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedTxn(t)} 
                  style={{ background: '#FFF', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ background: credit ? '#ECFDF5' : '#FEF2F2', padding: '10px', borderRadius: '50%', color: credit ? '#10B981' : '#EF4444' }}>
                    {credit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1A1A1A' }}>{credit ? 'Received' : 'Sent'} {t.type === 'transfer' ? 'Transfer' : t.type}</p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>{new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: credit ? '#10B981' : '#EF4444' }}>
                    {credit ? '+' : '-'} ₹{t.amount}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {selectedTxn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTxn(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>Transaction Receipt</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#888' }}>ID:</span><span style={{ color: '#1A1A1A', fontWeight: 600 }}>{selectedTxn._id.slice(-8).toUpperCase()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#888' }}>Mode:</span><span style={{ color: '#1A1A1A', fontWeight: 600 }}>{selectedTxn.mode || 'Internal'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#888' }}>Date:</span><span style={{ color: '#1A1A1A', fontWeight: 600 }}>{new Date(selectedTxn.createdAt).toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#888' }}>Amount:</span><span style={{ color: isCredit(selectedTxn) ? '#10B981' : '#EF4444', fontWeight: 700 }}>₹{selectedTxn.amount}</span></div>
              <button onClick={() => setSelectedTxn(null)} style={{ width: '100%', marginTop: '1.5rem', background: '#DBA030', color: '#FFF', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
