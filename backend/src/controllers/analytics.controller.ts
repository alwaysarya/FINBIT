import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const account = await prisma.account.findFirst({ where: { userId } });
    if (!account) { res.status(404).json({ status: 'error', message: 'Account not found' }); return; }
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const transactions = await prisma.transaction.findMany({ where: { accountId: account.id, createdAt: { gte: sixMonthsAgo } } });
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });
      monthlyData[monthName] = { income: 0, expense: 0 };
    }
    transactions.forEach(tx => {
      const monthName = new Date(tx.createdAt).toLocaleString('default', { month: 'short' });
      if (monthlyData[monthName]) {
        if (tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT') monthlyData[monthName].income += tx.amount;
        else monthlyData[monthName].expense += tx.amount;
      }
    });
    const chartData = Object.keys(monthlyData).map(month => ({ month, income: monthlyData[month].income / 100, expense: monthlyData[month].expense / 100 }));
    res.status(200).json({ status: 'success', data: chartData });
  } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch analytics' }); }
};
