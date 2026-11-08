const ScheduledTransfer = require('../models/ScheduledTransfer');

// Naya Schedule banao
const createSchedule = async (req, res, next) => {
  try {
    const { toAccountNumber, amount, description, scheduledDate } = req.body;
    if (!toAccountNumber || !amount || !scheduledDate) { res.status(400); throw new Error('Please provide all details'); }

    const scheduleDateObj = new Date(scheduledDate);
    if (scheduleDateObj <= new Date()) { res.status(400); throw new Error('Scheduled date must be in the future'); }

    const schedule = await ScheduledTransfer.create({
      user: req.user._id, toAccountNumber, amount: Number(amount), description, scheduledDate: scheduleDateObj,
    });

    res.status(201).json({ message: 'Transfer scheduled successfully!', schedule });
  } catch (error) { next(error); }
};

// Apne saare schedules dekho
const getSchedules = async (req, res, next) => {
  try {
    const schedules = await ScheduledTransfer.find({ user: req.user._id }).sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) { next(error); }
};

// Schedule cancel karo
const cancelSchedule = async (req, res, next) => {
  try {
    const schedule = await ScheduledTransfer.findById(req.params.id);
    if (!schedule) { res.status(404); throw new Error('Schedule not found'); }
    if (schedule.status !== 'pending') { res.status(400); throw new Error('Cannot cancel this schedule'); }

    schedule.status = 'cancelled';
    await schedule.save();
    res.json({ message: 'Schedule cancelled' });
  } catch (error) { next(error); }
};

module.exports = { createSchedule, getSchedules, cancelSchedule };
