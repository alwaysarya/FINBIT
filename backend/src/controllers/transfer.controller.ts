import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTransfer = async (req: Request, res: Response): Promise<void> => {
  try {
    // Yahan humne naye fields add kiye hain request body se
    const { senderId, receiverEmail, amount, beneficiaryName, accountNumber, ifscCode, bankName, remarks } = req.body;
    
    if (!senderId || !receiverEmail || !amount || amount <= 0) { res.status(400).json({ status: 'error', message: 'Invalid transfer details' }); return; }
    
    const sender = await prisma.user.findUnique({ where: { id: senderId }, include: { accounts: true } });
    
    // Agar receiverEmail database mein nahi hai, toh hum fake receiver bana rahe hain (testing ke liye)
    // Real banking mein yahan accountNumber aur IFSC se receiver verify hota hai
    let receiver = await prisma.user.findUnique({ where: { email: receiverEmail }, include: { accounts: true } });
    
    if (!receiver) {
       // Create a dummy receiver for simulation if not found (Standard rule: fake transfers for demo)
       const dummyUser = await prisma.user.create({
         data: {
           name: beneficiaryName || 'External Beneficiary',
           email: receiverEmail,
           password: 'dummy_password_hash', // Dummy password
           accounts: {
             create: {
               accountNumber: accountNumber || 'EXT-' + Math.floor(100000 + Math.random() * 900000).toString(),
               balance: 0,
               currency: 'USD'
             }
           }
         },
         include: { accounts: true }
       });
       receiver = dummyUser;
    }

    if (!sender || !receiver) { res.status(404).json({ status: 'error', message: 'User not found' }); return; }
    
    const senderAccount = sender.accounts[0];
    const receiverAccount = receiver.accounts[0];
    
    if (senderAccount.balance < amount) { res.status(400).json({ status: 'error', message: 'Insufficient funds' }); return; }

    const transactionDesc = remarks ? `Transfer to ${beneficiaryName}: ${remarks}` : `Transfer to ${beneficiaryName || receiver.name}`;

    await prisma.$transaction([
      prisma.account.update({ where: { id: senderAccount.id }, data: { balance: { decrement: amount } } }),
      prisma.account.update({ where: { id: receiverAccount.id }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({ 
        data: { 
          accountId: senderAccount.id, 
          type: 'TRANSFER_OUT', 
          amount: amount, 
          description: transactionDesc, 
          status: 'COMPLETED' 
        } 
      }),
      prisma.transaction.create({ 
        data: { 
          accountId: receiverAccount.id, 
          type: 'TRANSFER_IN', 
          amount: amount, 
          description: `Transfer from ${sender.name}`, 
          status: 'COMPLETED' 
        } 
      })
    ]);

    res.status(200).json({ status: 'success', message: 'Transfer completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Transfer failed' });
  }
};
