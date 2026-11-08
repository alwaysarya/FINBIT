import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    let cards = await prisma.card.findMany({ where: { userId } });

    // Agar user ke paas koi card nahi hai, toh ek virtual card generate kar do
    if (cards.length === 0) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) { res.status(404).json({ status: 'error', message: 'User not found' }); return; }

      const newCard = await prisma.card.create({
        data: {
          userId,
          cardNumber: '4532' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          cardHolder: user.name.toUpperCase(),
          expiryDate: '12/28',
          cvv: Math.floor(100 + Math.random() * 900).toString(),
        }
      });
      cards = [newCard];
    }

    res.status(200).json({ status: 'success', data: cards });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch cards' });
  }
};

export const toggleFreeze = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) { res.status(404).json({ status: 'error', message: 'Card not found' }); return; }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { isFrozen: !card.isFrozen }
    });

    res.status(200).json({ status: 'success', data: updatedCard });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update card' });
  }
};
