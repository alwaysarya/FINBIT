import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, currentPassword, newPassword } = req.body;
    
    if (!userId) { res.status(400).json({ status: 'error', message: 'User ID required' }); return; }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ status: 'error', message: 'User not found' }); return; }

    const updateData: any = { name };

    // Password change logic (Standard 8: Security)
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ status: 'error', message: 'Current password required to set a new one' });
        return;
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        res.status(401).json({ status: 'error', message: 'Incorrect current password' });
        return;
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Update local storage data for frontend
    res.status(200).json({
      status: 'success',
      data: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update profile' });
  }
};
