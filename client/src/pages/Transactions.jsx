import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const Transactions = () => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedTxn, setSelectedTxn] = useState(null); // Receipt popup ke liye
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/account/transactions')
      .then((res) => setTxns(res.data))
      .catch((err) => setToast({ message: 'Failed to load history', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading history...</p></div>;

  const isCredit = (txn) => {
    if (txn.type === 'credit') return true;
    if (txn.toAccount && user?.account?._id && txn.toAccount._id === user.account._id) return true;
    return false;
  };

  return (
    <div className="page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <h1>📜 Transaction History</h1>
      
      {txns.length === 0 ? (
        <div className="empty-state">No transactions found.</div>
      ) : (
        <div className="txn-list">
          {txns.map((t) => {
            const credit = isCredit(t);
            return (
              <div 
                key={t._id} 
                className="txn-item" 
                onClick={() => setSelectedTxn(t)} // Click pe popup khulega
                style={{ cursor: 'pointer' }}
              >
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

      {/* Receipt Modal (Popup) */}
      {selectedTxn && (
        <div className="modal-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🧾 Transaction Receipt</h2>
            <div className="receipt-row">
              <span>Transaction ID:</span>
              <span>{selectedTxn._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="receipt-row">
              <span>Date:</span>
              <span>{new Date(selectedTxn.createdAt).toLocaleString()}</span>
            </div>
            <div className="receipt-row">
              <span>Type:</span>
              <span style={{ textTransform: 'capitalize' }}>{selectedTxn.type}</span>
            </div>
            <div className="receipt-row">
              <span>Amount:</span>
              <span className={isCredit(selectedTxn) ? 'text-green' : 'text-red'}>
                ₹{selectedTxn.amount}
              </span>
            </div>
            <div className="receipt-row">
              <span>Status:</span>
              <span className="text-green">{selectedTxn.status}</span>
            </div>
            <div className="receipt-row">
              <span>Description:</span>
              <span>{selectedTxn.description || 'N/A'}</span>
            </div>
            <button onClick={() => setSelectedTxn(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
