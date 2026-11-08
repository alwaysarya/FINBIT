const Goal = require('../models/Goal');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Naya Goal banao
const createGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, icon } = req.body;
    if (!name || !targetAmount) { res.status(400); throw new Error('Please provide name and amount'); }
    
    const goal = await Goal.create({ user: req.user._id, name, targetAmount: Number(targetAmount), icon });
    res.status(201).json(goal);
  } catch (error) { next(error); }
};

// Apne saare goals dekho
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) { next(error); }
};

// Goal me paisa daalo (Account se deduct hoga)
const addMoneyToGoal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);
    if (!goal) { res.status(404); throw new Error('Goal not found'); }

    const account = await Account.findOne({ user: req.user._id });
    if (account.balance < amount) { res.status(400); throw new Error('Insufficient balance'); }

    // Account se paisa kato
    account.balance -= Number(amount);
    await account.save();

    // Goal me paisa daalo
    goal.savedAmount += Number(amount);
    await goal.save();

    // Transaction history me dikhne ke liye
    await Transaction.create({ fromAccount: account._id, amount: Number(amount), type: 'debit', status: 'success', description: `Saved for Goal: ${goal.name}` });

    res.json({ message: `₹${amount} added to ${goal.name}`, goal, newBalance: account.balance });
  } catch (error) { next(error); }
};

module.exports = { createGoal, getGoals, addMoneyToGoal };
