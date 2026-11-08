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
app.use('/api/beneficiary', require('./routes/beneficiaryRoutes')); // <-- Naya

app.get('/', (req, res) => res.json({ message: 'FINBIT API is running 🚀' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 FINBIT server running on port ${PORT}`));
