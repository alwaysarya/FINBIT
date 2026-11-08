const mongoose = require('mongoose');

const fdSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, default: 6.5 }, // 6.5% annual
    durationMonths: { type: Number, required: true }, // 6, 12, 24 months
    maturityAmount: { type: Number, required: true },
    maturityDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'matured', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FixedDeposit', fdSchema);
