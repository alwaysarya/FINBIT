const mongoose = require('mongoose');
const rdSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  monthlyAmount: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  interestRate: { type: Number, default: 7.0 },
  maturityAmount: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'matured'], default: 'active' },
}, { timestamps: true });
module.exports = mongoose.model('RecurringDeposit', rdSchema);
