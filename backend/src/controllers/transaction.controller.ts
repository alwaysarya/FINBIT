import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const account = await prisma.account.findFirst({ where: { userId } });
    if (!account) { res.status(404).json({ status: 'error', message: 'Account not found' }); return; }
    const transactions = await prisma.transaction.findMany({ where: { accountId: account.id }, orderBy: { createdAt: 'desc' }, take: 20 });
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch transactions' }); }
};
