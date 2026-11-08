import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getBeneficiaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const beneficiaries = await prisma.beneficiary.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: beneficiaries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch beneficiaries' });
  }
};

export const addBeneficiary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, email, accountNumber } = req.body;
    if (!userId || !name || !email) { res.status(400).json({ status: 'error', message: 'Required fields missing' }); return; }
    
    const newBeneficiary = await prisma.beneficiary.create({
      data: { ownerId: userId, name, email, accountNumber: accountNumber || 'N/A' }
    });
    res.status(201).json({ status: 'success', data: newBeneficiary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add beneficiary' });
  }
};

export const deleteBeneficiary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.beneficiary.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Beneficiary deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete beneficiary' });
  }
};
