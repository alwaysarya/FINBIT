import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Search, Download, FileText } from 'lucide-react';

const Transactions = () => {
  const [txns, setTxns] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/account/transactions').then((res) => { setTxns(res.data); setFilteredTxns(res.data); }).catch(() => setToast({ message: 'Failed to load', type: 'error' })).finally(() => setLoading(false));
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
    setToast({ message: 'Statement downloaded!', type: 'success' });
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={28} /> Transactions</h1>
        <button onClick={downloadCSV} className="edit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={16} /> Export CSV</button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '40px' }} />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="all">All Types</option>
          <option value="credit">Income</option>
          <option value="debit">Expense</option>
        </select>
      </div>
      
      {filteredTxns.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <motion.div className="txn-list" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
          {filteredTxns.map((t) => {
            const credit = isCredit(t);
            return (
              <motion.div key={t._id} className="txn-item" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} onClick={() => setSelectedTxn(t)}>
                <div className="txn-icon">
                  {credit ? <ArrowDownLeft size={18} color="var(--success)" /> : <ArrowUpRight size={18} color="var(--danger)" />}
                </div>
                <div className="txn-details">
                  <p className="txn-type">{credit ? 'Received' : 'Sent'} {t.type === 'transfer' ? 'Transfer' : t.type}</p>
                  <p className="txn-date">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <div className={`txn-amount ${credit ? 'text-green' : 'text-red'}`}>
                  {credit ? '+' : '-'} ₹{t.amount}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedTxn && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTxn(null)}>
          <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={22} /> Receipt</h2>
            <div className="receipt-row"><span>ID:</span><span>{selectedTxn._id.slice(-8).toUpperCase()}</span></div>
            <div className="receipt-row"><span>Mode:</span><span>{selectedTxn.mode || 'Internal'}</span></div>
            <div className="receipt-row"><span>Date:</span><span>{new Date(selectedTxn.createdAt).toLocaleString()}</span></div>
            <div className="receipt-row"><span>Amount:</span><span className={isCredit(selectedTxn) ? 'text-green' : 'text-red'}>₹{selectedTxn.amount}</span></div>
            <button onClick={() => setSelectedTxn(null)} className="close-btn">Close</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Transactions;
