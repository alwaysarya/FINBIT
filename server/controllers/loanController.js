const Loan = require('../models/Loan');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Naya Loan Apply karo
const applyLoan = async (req, res, next) => {
  try {
    const { loanType, amount, tenureMonths } = req.body;
    if (!loanType || !amount || !tenureMonths) { res.status(400); throw new Error('Please provide all details'); }

    // Fixed interest rate for simulation (10.5% for Personal, 8.5% Home, etc.)
    const rates = { personal: 10.5, home: 8.5, vehicle: 9.2, education: 7.5 };
    const interestRate = rates[loanType] || 10.5;

    // EMI Calculation (Formula: P * r * (1+r)^n / ((1+r)^n - 1))
    const monthlyRate = interestRate / (12 * 100);
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayable = emi * tenureMonths;

    const loan = await Loan.create({
      user: req.user._id, loanType, amount: Number(amount), interestRate, tenureMonths: Number(tenureMonths), 
      emi: Math.round(emi), totalPayable: Math.round(totalPayable), status: 'active' // Auto-approve for simulation
    });

    // Loan amount user ke account me daal do (simulation)
    const account = await Account.findOne({ user: req.user._id });
    account.balance += Number(amount);
    await account.save();

    await Transaction.create({ toAccount: account._id, amount: Number(amount), type: 'credit', status: 'success', description: `${loanType} Loan Disbursed` });
    await Notification.create({ user: req.user._id, title: 'Loan Approved', message: `₹${amount} loan has been credited to your account.` });

    res.status(201).json({ message: 'Loan approved and amount credited!', loan, newBalance: account.balance });
  } catch (error) { next(error); }
};

// Apne saare loans dekho
const getMyLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) { next(error); }
};

// EMI Calculator (Preview)
const calculateEMI = async (req, res, next) => {
  try {
    const { amount, tenureMonths, loanType } = req.body;
    const rates = { personal: 10.5, home: 8.5, vehicle: 9.2, education: 7.5 };
    const interestRate = rates[loanType] || 10.5;
    const monthlyRate = interestRate / (12 * 100);
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    res.json({ emi: Math.round(emi), totalPayable: Math.round(emi * tenureMonths), interestRate });
  } catch (error) { next(error); }
};

module.exports = { applyLoan, getMyLoans, calculateEMI };
