const Budget = require('../models/Budget');

// Apne budgets dekho
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) { next(error); }
};

// Naya budget set karo
const setBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;
    if (!category || !limit) { res.status(400); throw new Error('Please provide category and limit'); }

    const existing = await Budget.findOne({ user: req.user._id, category });
    if (existing) {
      existing.limit = limit;
      await existing.save();
      return res.json({ message: 'Budget updated', budget: existing });
    }

    const budget = await Budget.create({ user: req.user._id, category, limit });
    res.status(201).json({ message: 'Budget created', budget });
  } catch (error) { next(error); }
};

module.exports = { getBudgets, setBudget };
