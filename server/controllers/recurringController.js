const RecurringTransfer = require('../models/RecurringTransfer');

// Naya Auto-pay banao
const createRecurring = async (req, res, next) => {
  try {
    const { toAccountNumber, amount, description, frequency, nextRunDate } = req.body;
    if (!toAccountNumber || !amount || !frequency || !nextRunDate) { res.status(400); throw new Error('Please provide all details'); }

    const dateObj = new Date(nextRunDate);
    if (dateObj <= new Date()) { res.status(400); throw new Error('Next run date must be in the future'); }

    const recurring = await RecurringTransfer.create({
      user: req.user._id, toAccountNumber, amount: Number(amount), description, frequency, nextRunDate: dateObj,
    });

    res.status(201).json({ message: 'Recurring transfer created!', recurring });
  } catch (error) { next(error); }
};

// Apne Auto-pays dekho
const getRecurrings = async (req, res, next) => {
  try {
    const list = await RecurringTransfer.find({ user: req.user._id }).sort({ nextRunDate: 1 });
    res.json(list);
  } catch (error) { next(error); }
};

// Auto-pay cancel karo
const cancelRecurring = async (req, res, next) => {
  try {
    const item = await RecurringTransfer.findById(req.params.id);
    if (!item) { res.status(404); throw new Error('Recurring transfer not found'); }
    
    item.status = 'cancelled';
    await item.save();
    res.json({ message: 'Recurring transfer cancelled' });
  } catch (error) { next(error); }
};

module.exports = { createRecurring, getRecurrings, cancelRecurring };
