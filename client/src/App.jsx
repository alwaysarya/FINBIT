import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Deposit from './pages/Deposit';
import Profile from './pages/Profile';
import Bills from './pages/Bills';
import FixedDeposit from './pages/FixedDeposit';
import RecurringDeposit from './pages/RecurringDeposit'; // <-- Naya
import Beneficiaries from './pages/Beneficiaries';
import Goals from './pages/Goals';
import MyCard from './pages/MyCard';
import Rewards from './pages/Rewards';
import Requests from './pages/Requests';
import ScheduledTransfers from './pages/ScheduledTransfers';
import Ledger from './pages/Ledger';
import Recurring from './pages/Recurring';
import Loans from './pages/Loans';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Settings from './pages/Settings';
import ReferEarn from './pages/ReferEarn';
import Budget from './pages/Budget';

const Protected = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/deposit" element={<Protected><Deposit /></Protected>} />
          <Route path="/transfer" element={<Protected><Transfer /></Protected>} />
          <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/bills" element={<Protected><Bills /></Protected>} />
          <Route path="/fd" element={<Protected><FixedDeposit /></Protected>} />
          <Route path="/rd" element={<Protected><RecurringDeposit /></Protected>} /> {/* <-- Naya */}
          <Route path="/beneficiaries" element={<Protected><Beneficiaries /></Protected>} />
          <Route path="/goals" element={<Protected><Goals /></Protected>} />
          <Route path="/card" element={<Protected><MyCard /></Protected>} />
          <Route path="/rewards" element={<Protected><Rewards /></Protected>} />
          <Route path="/requests" element={<Protected><Requests /></Protected>} />
          <Route path="/scheduled" element={<Protected><ScheduledTransfers /></Protected>} />
          <Route path="/ledger" element={<Protected><Ledger /></Protected>} />
          <Route path="/recurring" element={<Protected><Recurring /></Protected>} />
          <Route path="/loans" element={<Protected><Loans /></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
          <Route path="/support" element={<Protected><Support /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/refer" element={<Protected><ReferEarn /></Protected>} />
          <Route path="/budget" element={<Protected><Budget /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
