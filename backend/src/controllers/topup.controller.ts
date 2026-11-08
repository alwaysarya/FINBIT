import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const topUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount || amount <= 0) {
      res.status(400).json({ status: 'error', message: 'Invalid amount' });
      return;
    }

    const account = await prisma.account.findFirst({ where: { userId } });
    if (!account) { res.status(404).json({ status: 'error', message: 'Account not found' }); return; }

    // Atomic transaction for deposit
    await prisma.$transaction([
      prisma.account.update({
        where: { id: account.id },
        data: { balance: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          accountId: account.id,
          type: 'DEPOSIT',
          amount: amount,
          description: 'Wallet Top Up',
          status: 'COMPLETED'
        }
      })
    ]);

    res.status(200).json({ status: 'success', message: 'Funds added successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Top up failed' });
  }
};
