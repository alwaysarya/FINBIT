import { useEffect, useState } from 'react';
import api from '../services/api';

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ledger').then(res => setEntries(res.data)).catch(err => console.log(err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading ledger...</p></div>;

  return (
    <div className="page">
      <h1>📒 Double-Entry Ledger</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Every transaction is recorded twice (Debit & Credit) for accuracy.</p>

      {entries.length === 0 ? <p>No ledger entries yet.</p> : (
        <table className="txn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e._id}>
                <td>{new Date(e.createdAt).toLocaleString()}</td>
                <td>{e.description}</td>
                <td className={e.entryType === 'debit' ? 'text-red' : 'text-green'}>
                  {e.entryType.toUpperCase()}
                </td>
                <td className={e.entryType === 'debit' ? 'text-red' : 'text-green'}>
                  ₹{e.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Ledger;
