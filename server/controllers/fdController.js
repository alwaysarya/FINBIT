const Account = require('../models/Account');
const FixedDeposit = require('../models/FixedDeposit');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Create a new FD
// @route   POST /api/fd/create
const createFD = async (req, res, next) => {
  try {
    const { amount, durationMonths } = req.body;
    if (!amount || amount < 1000) { res.status(400); throw new Error('Minimum FD amount is ₹1000'); }

    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    if (account.balance < amount) { res.status(400); throw new Error('Insufficient balance'); }

    // Maturity calculation (Simple Interest)
    const interestRate = 6.5;
    const timeYears = durationMonths / 12;
    const interest = (amount * interestRate * timeYears) / 100;
    const maturityAmount = amount + interest;
    
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + durationMonths);

    // Balance deduct karo
    account.balance -= Number(amount);
    await account.save();

    // FD create karo
    const fd = await FixedDeposit.create({
      user: req.user._id, amount: Number(amount), durationMonths: Number(durationMonths), maturityAmount: Number(maturityAmount.toFixed(2)), maturityDate,
    });

    // Transaction history me dikhne ke liye
    await Transaction.create({
      fromAccount: account._id, amount: Number(amount), type: 'debit', status: 'success', description: `FD Created for ${durationMonths} months`,
    });

    await Notification.create({ user: req.user._id, title: 'FD Created', message: `₹${amount} invested in FD for ${durationMonths} months. Maturity Amount: ₹${maturityAmount.toFixed(2)}` });

    res.status(201).json({ message: 'FD created successfully', fd, newBalance: account.balance });
  } catch (error) { next(error); }
};

// @desc    Get user's FDs
// @route   GET /api/fd
const getMyFDs = async (req, res, next) => {
  try {
    const fds = await FixedDeposit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(fds);
  } catch (error) { next(error); }
};

module.exports = { createFD, getMyFDs };
