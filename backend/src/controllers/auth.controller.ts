import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ status: 'error', message: 'Email and password required' }); return; }
    const user = await prisma.user.findUnique({ where: { email }, include: { accounts: true } });
    if (!user) { res.status(401).json({ status: 'error', message: 'Invalid credentials' }); return; }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) { res.status(401).json({ status: 'error', message: 'Invalid credentials' }); return; }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(200).json({ status: 'success', data: { token, user: { id: user.id, name: user.name, email: user.email, accountBalance: user.accounts[0]?.balance || 0 } } });
  } catch (error) { res.status(500).json({ status: 'error', message: 'Internal server error' }); }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400).json({ status: 'error', message: 'All fields required' }); return; }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) { res.status(400).json({ status: 'error', message: 'Email already in use' }); return; }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = 'ACC-' + Math.floor(1000 + Math.random() * 9000);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, accounts: { create: { accountNumber, balance: 100000, currency: 'USD' } } },
      include: { accounts: true }
    });
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ status: 'success', data: { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, accountBalance: newUser.accounts[0].balance } } });
  } catch (error) { res.status(500).json({ status: 'error', message: 'Registration failed' }); }
};
