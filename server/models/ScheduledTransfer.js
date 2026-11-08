const mongoose = require('mongoose');

const scheduledTransferSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toAccountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: 'Scheduled Transfer' },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScheduledTransfer', scheduledTransferSchema);
