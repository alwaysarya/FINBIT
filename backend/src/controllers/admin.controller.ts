import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        accounts: { select: { balance: true, accountNumber: true } }
      }
    });
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true, cards: true }
    });
    if (!user) { res.status(404).json({ status: 'error', message: 'User not found' }); return; }
    
    // Remove password from response (Standard 8: Security)
    const { password, ...safeUser } = user;
    res.status(200).json({ status: 'success', data: safeUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch user' });
  }
};
