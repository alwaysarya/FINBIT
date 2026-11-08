import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import transferRoutes from './routes/transfer.routes';
import transactionRoutes from './routes/transaction.routes';
import analyticsRoutes from './routes/analytics.routes';
import accountRoutes from './routes/account.routes';
import dashboardRoutes from './routes/dashboard.routes';
import cardRoutes from './routes/card.routes';
import profileRoutes from './routes/profile.routes';
import topupRoutes from './routes/topup.routes';
import beneficiaryRoutes from './routes/beneficiary.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => { res.status(200).json({ status: 'success', message: 'FINBIT API is healthy' }); });

app.use('/api/auth', authRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/topup', topupRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/admin', adminRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => { console.log(`🚀 Server running on http://localhost:${PORT}`); });
