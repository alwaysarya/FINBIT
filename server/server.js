const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/account', require('./routes/accountRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/fd', require('./routes/fdRoutes'));
app.use('/api/beneficiary', require('./routes/beneficiaryRoutes'));
app.use('/api/goal', require('./routes/goalRoutes'));
app.use('/api/card', require('./routes/cardRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/scheduled', require('./routes/scheduledRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/recurring', require('./routes/recurringRoutes'));
app.use('/api/loan', require('./routes/loanRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/referral', require('./routes/referralRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes')); // <-- Naya

app.get('/', (req, res) => res.json({ message: 'FINBIT API is running 🚀' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 FINBIT server running on port ${PORT}`));
