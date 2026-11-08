import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

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
    api.get('/account/transactions')
      .then((res) => {
        setTxns(res.data);
        setFilteredTxns(res.data);
      })
      .catch((err) => setToast({ message: 'Failed to load history', type: 'error' }))
      .finally(() => setLoading(false));
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
      result = result.filter(t => 
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.amount.toString().includes(searchTerm)
      );
    }
    setFilteredTxns(result);
  }, [searchTerm, filterType, txns, user]);

  const isCredit = (txn) => {
    if (txn.type === 'credit') return true;
    if (txn.toAccount && user?.account?._id && txn.toAccount._id === user.account._id) return true;
    return false;
  };

  // NAYA: CSV Download Function
  const downloadCSV = () => {
    if (filteredTxns.length === 0) return;
    
    const headers = ['Transaction ID', 'Date', 'Type', 'Description', 'Amount', 'Status'];
    const rows = filteredTxns.map(t => [
      t._id,
      new Date(t.createdAt).toLocaleString(),
      isCredit(t) ? 'Credit' : 'Debit',
      t.description || 'N/A',
      t.amount,
      t.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'finbit_statement.csv';
    link.click();
    setToast({ message: 'Statement downloaded successfully!', type: 'success' });
  };

  if (loading) return <div className="page"><p>Loading history...</p></div>;

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>📜 Transaction History</h1>
        <button onClick={downloadCSV} className="edit-btn" style={{ background: '#10b981' }}>⬇️ Download CSV</button>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="credit">Income (Credit)</option>
          <option value="debit">Expense (Debit)</option>
        </select>
      </div>
      
      {filteredTxns.length === 0 ? (
        <div className="empty-state">No transactions found.</div>
      ) : (
        <div className="txn-list">
          {filteredTxns.map((t) => {
            const credit = isCredit(t);
            return (
              <div key={t._id} className="txn-item" onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }}>
                <div className="txn-icon">{credit ? '↓' : '↑'}</div>
                <div className="txn-details">
                  <p className="txn-type">{credit ? 'Received' : 'Sent'} {t.type === 'transfer' ? 'Transfer' : t.type}</p>
                  <p className="txn-date">{new Date(t.createdAt).toLocaleString()}</p>
                  {t.description && <p className="txn-desc">{t.description}</p>}
                </div>
                <div className={`txn-amount ${credit ? 'text-green' : 'text-red'}`}>
                  {credit ? '+' : '-'} ₹{t.amount}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTxn && (
        <div className="modal-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🧾 Receipt</h2>
            <div className="receipt-row"><span>ID:</span><span>{selectedTxn._id.slice(-8).toUpperCase()}</span></div>
            <div className="receipt-row"><span>Date:</span><span>{new Date(selectedTxn.createdAt).toLocaleString()}</span></div>
            <div className="receipt-row"><span>Amount:</span><span className={isCredit(selectedTxn) ? 'text-green' : 'text-red'}>₹{selectedTxn.amount}</span></div>
            <div className="receipt-row"><span>Status:</span><span className="text-green">{selectedTxn.status}</span></div>
            <button onClick={() => setSelectedTxn(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
