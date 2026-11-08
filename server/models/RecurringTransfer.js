const mongoose = require('mongoose');

const recurringSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toAccountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: 'Recurring Payment' },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    nextRunDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTransfer', recurringSchema);
