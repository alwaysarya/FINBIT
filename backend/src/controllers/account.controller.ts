import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const accounts = await prisma.account.findMany({ where: { userId }, include: { user: { select: { name: true, email: true } } } });
    res.status(200).json({ status: 'success', data: accounts });
  } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch accounts' }); }
};
