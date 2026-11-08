import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const account = await prisma.account.findFirst({ where: { userId } });
    if (!account) { res.status(404).json({ status: 'error', message: 'Account not found' }); return; }

    // Calculate total income and expenses from transactions
    const transactions = await prisma.transaction.findMany({ where: { accountId: account.id } });
    
    let income = 0;
    let expenses = 0;

    transactions.forEach(tx => {
      if (tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT') income += tx.amount;
      else expenses += tx.amount;
    });

    res.status(200).json({
      status: 'success',
      data: {
        balance: account.balance,
        income,
        expenses
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch dashboard stats' });
  }
};
