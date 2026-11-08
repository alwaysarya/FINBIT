const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

const transferMoney = async (req, res, next) => {
  try {
    const { toAccountNumber, amount, description } = req.body;
    if (!toAccountNumber || !amount || amount <= 0) { res.status(400); throw new Error('Invalid details'); }
    
    const senderAccount = await Account.findOne({ user: req.user._id });
    const receiverAccount = await Account.findOne({ accountNumber: toAccountNumber });
    
    if (!senderAccount || !receiverAccount) { res.status(404); throw new Error('Account not found'); }
    if (senderAccount.accountNumber === toAccountNumber) { res.status(400); throw new Error('Cannot transfer to self'); }
    if (senderAccount.balance < amount) { res.status(400); throw new Error('Insufficient balance'); }

    senderAccount.balance -= Number(amount);
    receiverAccount.balance += Number(amount);
    await senderAccount.save();
    await receiverAccount.save();

    const transaction = await Transaction.create({
      fromAccount: senderAccount._id, toAccount: receiverAccount._id, amount: Number(amount), type: 'transfer', status: 'success', description: description || 'Money transfer',
    });

    // NAYA: Reward Points (Har ₹100 pe 1 point)
    const pointsEarned = Math.floor(amount / 100);
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(senderAccount.user, { $inc: { rewardPoints: pointsEarned } });
    }

    await Notification.create([
      { user: senderAccount.user, title: 'Money Sent', message: `You sent ₹${amount} to A/C ${toAccountNumber}.` },
      { user: receiverAccount.user, title: 'Money Received', message: `You received ₹${amount} from A/C ${senderAccount.accountNumber}.` }
    ]);

    res.status(201).json({ message: 'Transfer successful', transaction, newBalance: senderAccount.balance });
  } catch (error) { next(error); }
};

const depositMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    
    account.balance += Number(amount);
    await account.save();

    // NAYA: Deposit pe bhi points
    const pointsEarned = Math.floor(amount / 100);
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: pointsEarned } });
    }

    const transaction = await Transaction.create({ toAccount: account._id, amount: Number(amount), type: 'credit', status: 'success', description: 'Deposit' });
    await Notification.create({ user: req.user._id, title: 'Deposit Successful', message: `₹${amount} has been added to your account.` });

    res.status(201).json({ message: 'Deposit successful', transaction, newBalance: account.balance });
  } catch (error) { next(error); }
};

const payBill = async (req, res, next) => {
  try {
    const { billType, billerName, amount } = req.body;
    if (!billType || !billerName || !amount || amount <= 0) { res.status(400); throw new Error('Please provide all details'); }
    
    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    if (account.balance < amount) { res.status(400); throw new Error('Insufficient balance'); }

    account.balance -= Number(amount);
    await account.save();

    // NAYA: Bill payment pe bhi points
    const pointsEarned = Math.floor(amount / 100);
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: pointsEarned } });
    }

    const transaction = await Transaction.create({
      fromAccount: account._id, amount: Number(amount), type: 'debit', status: 'success', description: `${billType} - ${billerName}`,
    });

    await Notification.create({ user: req.user._id, title: `${billType} Paid`, message: `₹${amount} paid for ${billerName}.` });

    res.status(201).json({ message: 'Payment successful', transaction, newBalance: account.balance });
  } catch (error) { next(error); }
};

module.exports = { transferMoney, depositMoney, payBill };
