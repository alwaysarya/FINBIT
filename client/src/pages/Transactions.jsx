import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, Download, FileText } from 'lucide-react';

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
          <button onClick={downloadCSV} style={{ background: '#1A1A1A', color: '#FFF', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
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
