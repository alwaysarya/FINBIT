const RecurringDeposit = require('../models/RecurringDeposit');
const Account = require('../models/Account');

const createRD = async (req, res, next) => {
  try {
    const { monthlyAmount, durationMonths } = req.body;
    if (!monthlyAmount || monthlyAmount < 500) { res.status(400); throw new Error('Minimum RD is ₹500/month'); }

    const account = await Account.findOne({ user: req.user._id });
    if (account.balance < monthlyAmount) { res.status(400); throw new Error('Insufficient balance for first installment'); }

    // Deduct first installment
    account.balance -= Number(monthlyAmount);
    await account.save();

    const interestRate = 7.0;
    const totalDeposit = monthlyAmount * durationMonths;
    const interest = (totalDeposit * interestRate * (durationMonths / 12)) / 100;
    const maturityAmount = totalDeposit + interest;

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + Number(durationMonths));

    const rd = await RecurringDeposit.create({
      user: req.user._id, monthlyAmount: Number(monthlyAmount), durationMonths: Number(durationMonths),
      maturityAmount: Math.round(maturityAmount), maturityDate,
    });

    res.status(201).json({ message: 'RD created! First installment deducted.', rd, newBalance: account.balance });
  } catch (error) { next(error); }
};

const getMyRDs = async (req, res, next) => {
  try {
    const rds = await RecurringDeposit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rds);
  } catch (error) { next(error); }
};

module.exports = { createRD, getMyRDs };
